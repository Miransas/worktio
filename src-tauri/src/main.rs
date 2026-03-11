use serde::{Serialize, Deserialize};
use tauri::Manager;
mod database;
mod video;
mod auth;
mod user_db;

#[derive(Serialize, Deserialize)]
struct YouTubeComment {
    author: String,
    text: String,
    published_at: String,
}

// 1. MOTOR: YouTube'dan yorumları çeken fonksiyon
#[tauri::command]
async fn fetch_latest_comments(api_key: String, video_id: String) -> Result<Vec<YouTubeComment>, String> {
    let url = format!(
        "https://www.googleapis.com/youtube/v3/commentThreads?key={}&textFormat=plainText&part=snippet&videoId={}&maxResults=10",
        api_key, video_id
    );

    let response = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string());

    // JSON'dan bizim struct yapısına dönüştürme (Hızlıca)
    let mut comments = Vec::new();
    if let Ok(data) = response {
        if let Some(items) = data["items"].as_array() {
            for item in items {
                let snippet = &item["snippet"]["topLevelComment"]["snippet"];
                comments.push(YouTubeComment {
                    author: snippet["authorDisplayName"].as_str().unwrap_or("Anonim").to_string(),
                    text: snippet["textDisplay"].as_str().unwrap_or("").to_string(),
                    published_at: snippet["publishedAt"].as_str().unwrap_or("").to_string(),
                });
            }
        }
    }
    
    Ok(comments)
}



fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_latest_comments])
        .run(tauri::generate_context!())
        .expect("Worktio motoru başlatılamadı!");
}