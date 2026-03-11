#[tauri::command]
async fn check_youtube_status() -> Result<String, String> {
    // Burada ileride API anahtarlarını ve kanal durumunu kontrol edeceğiz
    Ok("Ustam, YouTube kanalı aktif. Veri akışı için hazırız!".into())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_youtube_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}