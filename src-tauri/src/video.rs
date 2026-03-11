use std::process::Command;
use tauri::AppHandle;

#[tauri::command]
pub async fn convert_to_shorts(input_path: String, output_path: String) -> Result<String, String> {
    // M1 Mac (Apple Silicon) için donanım hızlandırmalı (h264_videotoolbox) komut
    // Bu komut videoyu 1080x1920 yapar ve tam ortayı odaklar.
    let status = Command::new("ffmpeg")
        .args([
            "-i", &input_path,
            "-vf", "crop=ih*9/16:ih,scale=1080:1920", // 9:16 oranında kırp ve ölçekle
            "-c:v", "h264_videotoolbox", // Apple Silicon donanım hızlandırma!
            "-b:v", "5M",                // Kaliteli bit hızı
            "-preset", "fast",
            &output_path,
        ])
        .status();

    match status {
        Ok(s) if s.success() => Ok("Ustam, Shorts render başarıyla tamamlandı!".into()),
        _ => Err("FFmpeg motoru bir hata verdi. Yolu kontrol et ustam.".into()),
    }
}