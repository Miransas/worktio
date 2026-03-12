use rusqlite::params;
use crate::database::init_db;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::Utc;

#[derive(Serialize, Deserialize, Clone)]
pub struct Account {
    pub id: String,
    pub platform: String,
    pub username: String,
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_at: Option<i64>,
}

pub fn save_account(account: &Account) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR REPLACE INTO accounts 
         (id, platform, username, access_token, refresh_token, expires_at, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            account.id,
            account.platform,
            account.username,
            account.access_token,
            account.refresh_token,
            account.expires_at,
            Utc::now().timestamp()
        ],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_accounts() -> Result<Vec<Account>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT id, platform, username, access_token, refresh_token, expires_at FROM accounts"
    ).map_err(|e| e.to_string())?;
    
    let accounts = stmt.query_map([], |row| {
        Ok(Account {
            id: row.get(0)?,
            platform: row.get(1)?,
            username: row.get(2)?,
            access_token: row.get(3)?,
            refresh_token: row.get(4)?,
            expires_at: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?
    .filter_map(|r| r.ok())
    .collect();
    
    Ok(accounts)
}

pub fn delete_account(id: &str) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM accounts WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}