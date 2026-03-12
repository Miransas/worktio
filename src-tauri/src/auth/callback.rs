use std::net::TcpListener;
use std::io::{Read, Write};
use std::collections::HashMap;

// Tarayıcıdan gelen callback'i yakalar
// http://localhost:9876/callback?code=xxx&state=yyy
pub async fn wait_for_callback() -> Result<HashMap<String, String>, String> {
    let listener = TcpListener::bind("127.0.0.1:9876")
        .map_err(|e| format!("Port açılamadı: {}", e))?;

    let (mut stream, _) = listener.accept()
        .map_err(|e| format!("Bağlantı hatası: {}", e))?;

    let mut request = String::new();
    let mut buffer = [0; 4096];
    let n = stream.read(&mut buffer)
        .map_err(|e| e.to_string())?;
    request.push_str(&String::from_utf8_lossy(&buffer[..n]));

    // HTTP request'ten query parametrelerini çek
    let params = parse_query_params(&request);

    // Tarayıcıya "bitti, kapat" sayfası göster
    let html = r#"
        <html>
        <head>
            <style>
                body { background: #050508; color: #fff; 
                       font-family: sans-serif; display: flex; 
                       align-items: center; justify-content: center; 
                       height: 100vh; margin: 0; }
                .box { text-align: center; }
                h1 { color: #d946ef; }
                p { color: #a3a3a3; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>✅ Bağlantı Başarılı!</h1>
                <p>Bu sekmeyi kapatabilirsiniz.</p>
            </div>
            <script>setTimeout(() => window.close(), 2000);</script>
        </body>
        </html>
    "#;

    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
        html.len(), html
    );
    stream.write_all(response.as_bytes()).ok();

    Ok(params)
}

fn parse_query_params(request: &str) -> HashMap<String, String> {
    let mut params = HashMap::new();

    // GET /callback?code=xxx&state=yyy HTTP/1.1
    let first_line = request.lines().next().unwrap_or("");
    let path = first_line.split_whitespace().nth(1).unwrap_or("");

    if let Some(query) = path.split('?').nth(1) {
        for pair in query.split('&') {
            let mut parts = pair.splitn(2, '=');
            if let (Some(k), Some(v)) = (parts.next(), parts.next()) {
                params.insert(
                    urlencoding::decode(k).unwrap_or_default().to_string(),
                    urlencoding::decode(v).unwrap_or_default().to_string(),
                );
            }
        }
    }

    params
}