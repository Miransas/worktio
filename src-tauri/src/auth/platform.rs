use reqwest::Client;
use serde_json::Value;

// YouTube — bağlanan kullanıcının adını al
pub async fn get_youtube_username(access_token: &str) -> Result<String, String> {
    let client = Client::new();
    let res = client
        .get("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true")
        .bearer_auth(access_token)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(res["items"][0]["snippet"]["title"]
        .as_str()
        .unwrap_or("YouTube Hesabı")
        .to_string())
}

// Instagram (Graph API)
pub async fn get_instagram_username(access_token: &str) -> Result<String, String> {
    let client = Client::new();
    let res = client
        .get(format!("https://graph.instagram.com/me?fields=username&access_token={}", access_token))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(res["username"].as_str().unwrap_or("Instagram Hesabı").to_string())
}

// Twitter/X
pub async fn get_twitter_username(access_token: &str) -> Result<String, String> {
    let client = Client::new();
    let res = client
        .get("https://api.twitter.com/2/users/me")
        .bearer_auth(access_token)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(res["data"]["username"].as_str().unwrap_or("Twitter Hesabı").to_string())
}

// Telegram — Bot token ile çalışır, OAuth yok
pub async fn get_telegram_bot_info(bot_token: &str) -> Result<String, String> {
    let client = Client::new();
    let res = client
        .get(format!("https://api.telegram.org/bot{}/getMe", bot_token))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(res["result"]["username"].as_str().unwrap_or("Telegram Bot").to_string())
}