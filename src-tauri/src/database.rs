use sqlx::{sqlite::SqlitePool, Pool, Sqlite};
use std::fs;
use tauri::{AppHandle, Manager};

pub async fn init_db(app_handle: &AppHandle) -> anyhow::Result<Pool<Sqlite>> {
    // Uygulama verilerinin saklanacağı yolu bul (macOS/Win/Linux uyumlu)
    let app_dir = app_handle.path().app_data_dir().expect("AppData yolu bulunamadı");
    fs::create_dir_all(&app_dir)?;
    
    let db_path = app_dir.join("worktio_vault.db");
    let db_url = format!("sqlite:{}", db_path.to_str().unwrap());

    // Bağlantı havuzunu oluştur
    let pool = SqlitePool::connect(&db_url).await?;

    // İlk tabloyu (Yorumlar) oluşturalım: UrbanTracker Edition
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS youtube_comments (
            id TEXT PRIMARY KEY,
            video_id TEXT,
            author TEXT,
            content TEXT,
            published_at TEXT,
            sentiment TEXT DEFAULT 'neutral'
        )"
    )
    .execute(&pool)
    .await?;

    Ok(pool)
}