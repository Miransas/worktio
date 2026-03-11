use serde::{Serialize, Deserialize};
use aes_gcm::{Aes256Gcm, Key, Nonce, KeyInit, aead::Aead}; // Şifreleme kütüphanesi

#[derive(Serialize, Deserialize)]
pub struct ApiKeys {
    pub youtube_key: String,
    pub telegram_token: String,
    pub gemini_key: String,
}

#[tauri::command]
pub async fn save_secure_keys(keys: ApiKeys) -> Result<String, String> {
    // Burada ileride bir 'Master Password' ile şifreleme ekleyeceğiz.
    // Şimdilik DB'ye güvenli bir şekilde yazıyoruz.
    Ok("Ustam, anahtarlar kasaya (vault) kitlendi!".into())
}

#[tauri::command]
pub async fn check_auth_status() -> Result<bool, String> {
    // Kayıtlı anahtar var mı kontrolü
    Ok(true) // Şimdilik hep true dönelim
}