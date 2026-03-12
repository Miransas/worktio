use rusqlite::{Connection, Result};
use std::path::PathBuf;

pub fn get_db_path() -> PathBuf {
    let home = dirs::home_dir().unwrap();
    home.join(".worktio").join("worktio.db")
}

pub fn init_db() -> Result<Connection> {
    let path = get_db_path();
    std::fs::create_dir_all(path.parent().unwrap()).ok();
    
    let conn = Connection::open(&path)?;
    
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS accounts (
            id          TEXT PRIMARY KEY,
            platform    TEXT NOT NULL,
            username    TEXT NOT NULL,
            access_token    TEXT NOT NULL,
            refresh_token   TEXT,
            expires_at      INTEGER,
            created_at      INTEGER NOT NULL
        );
    ")?;
    
    Ok(conn)
}