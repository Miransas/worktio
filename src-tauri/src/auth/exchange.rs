use reqwest::Client;
use serde::{Serialize, Deserialize};
use crate::auth::oauth::OAuthConfig;

#[derive(Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_in: Option<i64>,
    pub token_type: Option<String>,
}

pub async fn exchange_code_for_token(
    config: &OAuthConfig,
    code: &str,
) -> Result<TokenResponse, String> {
    let client = Client::new();

    let params = [
        ("code", code),
        ("client_id", &config.client_id),
        ("client_secret", &config.client_secret),
        ("redirect_uri", &config.redirect_uri),
        ("grant_type", "authorization_code"),
    ];

    let response = client
        .post(&config.token_url)
        .form(&params)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<TokenResponse>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(response)
}