use sqlx::{sqlite::SqlitePool, Pool, Sqlite};
use std::fs;
use tauri::{AppHandle, Manager};

pub async fn init_database(app_handle: &AppHandle) -> anyhow::Result<Pool<Sqlite>> {
    // Uygulama verilerinin yolu (M1 Mac'te ~/Library/Application Support/worktio)
    let app_dir = app_handle.path().app_data_dir().expect("Yol bulunamadı");
    fs::create_dir_all(&app_dir)?;
    
    let db_path = app_dir.join("worktio_secure.db");
    let db_url = format!("sqlite:{}", db_path.to_str().unwrap());

    let pool = SqlitePool::connect(&db_url).await?;

    // AUTH TABLOSU: Anahtarlar burada yatar
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS vault (
            key_name TEXT PRIMARY KEY,
            key_value TEXT NOT NULL
        )"
    )
    .execute(&pool)
    .await?;

    Ok(pool)
}