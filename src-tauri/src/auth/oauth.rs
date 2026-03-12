use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct OAuthConfig {
    pub client_id: String,
    pub client_secret: String,
    pub auth_url: String,
    pub token_url: String,
    pub scopes: Vec<String>,
    pub redirect_uri: String,
}

// Her platform için config
pub fn youtube_config() -> OAuthConfig {
    OAuthConfig {
        client_id: env!("YOUTUBE_CLIENT_ID").to_string(),
        client_secret: env!("YOUTUBE_CLIENT_SECRET").to_string(),
        auth_url: "https://accounts.google.com/o/oauth2/v2/auth".to_string(),
        token_url: "https://oauth2.googleapis.com/token".to_string(),
        scopes: vec![
            "https://www.googleapis.com/auth/youtube.readonly".to_string(),
            "https://www.googleapis.com/auth/youtube.upload".to_string(),
        ],
        redirect_uri: "http://localhost:9876/callback".to_string(),
    }
}

pub fn telegram_config() -> OAuthConfig {
    OAuthConfig {
        client_id: "".to_string(),
        client_secret: "".to_string(),
        auth_url: "https://oauth.telegram.org/auth".to_string(),
        token_url: "".to_string(),
        scopes: vec![],
        redirect_uri: "http://localhost:9876/callback".to_string(),
    }
}

// Auth URL üret — tarayıcıda açılacak
pub fn build_auth_url(config: &OAuthConfig, state: &str) -> String {
    format!(
        "{}?client_id={}&redirect_uri={}&response_type=code&scope={}&state={}",
        config.auth_url,
        config.client_id,
        urlencoding::encode(&config.redirect_uri),
        urlencoding::encode(&config.scopes.join(" ")),
        state
    )
}