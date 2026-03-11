import { invoke } from '@tauri-apps/api/core';
import React, { useState } from 'react'

const page = () => {
    const [youtubeKey, setYoutubeKey] = useState('');
    const [telegramToken, setTelegramToken] = useState('');
    const [geminiKey, setGeminiKey] = useState('');

    const saveKeys = async () => {
        try {
            await invoke('save_api_key', { name: 'YT_KEY', value: youtubeKey });
            await invoke('save_api_key', { name: 'TG_TOKEN', value: telegramToken });
            await invoke('save_api_key', { name: 'GEMINI_KEY', value: geminiKey });
            // Başarılıysa Dashboard'a yönlendir
        } catch (err) {
            console.error("Ustam anahtarlar kasaya girmedi!", err);
        }
    };

    return (
        <div>page</div>
    )
}

export default page