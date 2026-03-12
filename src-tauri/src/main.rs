mod auth;
mod database;



use auth::callback::wait_for_callback;
use auth::exchange::exchange_code_for_token;
use auth::platforms::*;
use auth::tokens::{save_account, Account};
use auth::oauth::{youtube_config, instagram_config, twitter_config};
use chrono::Utc;
use uuid::Uuid;

#[tauri::command]
async fn connect_platform(platform: String) -> Result<String, String> {
    match platform.as_str() {
        "telegram" => {
            // Telegram bot token manuel girilir, OAuth yok
            return Ok("manual_token_required".to_string());
        }
        _ => {}
    }

    let config = match platform.as_str() {
        "youtube"   => youtube_config(),
        "instagram" => instagram_config(),
        "twitter"   => twitter_config(),
        _ => return Err("Desteklenmeyen platform".to_string()),
    };

    // 1. Tarayıcıyı aç
    let state = Uuid::new_v4().to_string();
    let url = auth::oauth::build_auth_url(&config, &state);
    open::that(&url).map_err(|e| e.to_string())?;

    // 2. Callback'i bekle
    let params = wait_for_callback().await?;
    let code = params.get("code").ok_or("Code gelmedi")?;

    // 3. Token al
    let token_res = exchange_code_for_token(&config, code).await?;

    // 4. Kullanıcı adını al
    let username = match platform.as_str() {
        "youtube"   => get_youtube_username(&token_res.access_token).await?,
        "instagram" => get_instagram_username(&token_res.access_token).await?,
        "twitter"   => get_twitter_username(&token_res.access_token).await?,
        _ => "Bilinmeyen".to_string(),
    };

    // 5. DB'ye kaydet
    let expires_at = token_res.expires_in
        .map(|s| Utc::now().timestamp() + s);

    save_account(&Account {
        id: Uuid::new_v4().to_string(),
        platform: platform.clone(),
        username,
        access_token: token_res.access_token,
        refresh_token: token_res.refresh_token,
        expires_at,
    })?;

    Ok(format!("{} bağlandı!", platform))
}

// Telegram özel — bot token ile
#[tauri::command]
async fn connect_telegram(bot_token: String) -> Result<String, String> {
    let username = get_telegram_bot_info(&bot_token).await?;

    save_account(&Account {
        id: Uuid::new_v4().to_string(),
        platform: "telegram".to_string(),
        username: username.clone(),
        access_token: bot_token,
        refresh_token: None,
        expires_at: None,
    })?;

    Ok(format!("@{} bağlandı!", username))
}