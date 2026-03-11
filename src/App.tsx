"use client";

import { useState } from "react";

import { invoke } from "@tauri-apps/api/core";
import { BsShieldLock } from "react-icons/bs";
import { BiPlay } from "react-icons/bi";
import { FiMessageSquare, FiShieldOff, FiVideo } from "react-icons/fi";

export default function WorktioDashboard() {
  const [status, setStatus] = useState("Sistem Hazır, Ustam.");
  const [isRendering, setIsRendering] = useState(false);

  // 🚀 RENDER MOTORUNU TETİKLE (Rust -> video.rs)
  const startShortsRender = async () => {
    setIsRendering(true);
    setStatus("Render Başladı... M1 İşlemci Şaha Kalkıyor.");
    
    try {
      const result = await invoke("convert_to_shorts", {
        inputPath: "/Users/user/Movies/input.mp4", // Şimdilik hardcoded, sonra file-picker ekleriz
        outputPath: "/Users/user/Movies/worktio_shorts.mp4"
      });
      setStatus(result as string);
    } catch (err) {
      setStatus("Hata: " + err);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <main className="flex h-screen bg-[#050505] text-gray-300 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR (Sol Panel) */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 bg-black/40 backdrop-blur-xl">
        <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl mb-12 flex items-center justify-center shadow-lg shadow-purple-500/30 font-bold text-white">W</div>
        <nav className="flex flex-col gap-10">
          <YoutubeIcon className="hover:text-red-500 cursor-pointer transition-all" />
          <TelegramIcon className="hover:text-blue-400 cursor-pointer transition-all" />
          <AIIcon className="hover:text-purple-400 cursor-pointer transition-all" />
        </nav>
      </aside>

      {/* 2. CENTRAL NODE (Ana Operasyon Alanı) */}
      <section className="flex-1 relative flex flex-col items-center justify-center p-10">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Worktio Core Node (Görseldeki O Yapı) */}
        <div 
          onClick={startShortsRender}
          className={`group relative z-10 w-48 h-48 rounded-[2.5rem] bg-purple-900/10 border border-purple-500/30 backdrop-blur-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-105 hover:border-purple-500/60 ${isRendering ? 'animate-pulse' : ''}`}
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
          <BiPlay className={`w-12 h-12 ${isRendering ? 'text-yellow-400' : 'text-purple-400'} mb-2 transition-colors`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/70">Render Engine</span>
        </div>

        {/* Alt Bilgi Paneli */}
        <div className="mt-12 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-500">
          STATUS: <span className="text-gray-300">{status}</span>
        </div>
      </section>

      {/* 3. SAĞ PANEL (Live Stats & Comments) */}
      <aside className="w-80 border-l border-white/5 bg-black/20 backdrop-blur-3xl p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-500">UrbanTracker Live</h2>
          <BsShieldLock className="w-4 h-4 text-green-500/50" />
        </div>

        <div className="space-y-4">
          <CommentCard author="Sad (Lost Signal)" text="Ustam render ne alemde? Bu sahne çok kritik." type="AI" />
          <CommentCard author="User_404" text="Shorts formatı çok akıcı olmuş, eline sağlık." type="YT" />
        </div>
      </aside>

    </main>
  );
}

// Yardımcı Bileşenler (Kısaltma)
const CommentCard = ({ author, text, type }: any) => (
  <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all cursor-default">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-1.5 h-1.5 rounded-full ${type === 'AI' ? 'bg-purple-500' : 'bg-red-500'}`}></div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{author}</span>
    </div>
    <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
  </div>
);

// Ikonları Lucide'den alıyoruz (İsimlendirme temsili)
const YoutubeIcon = (props: any) => <FiVideo {...props} />;
const TelegramIcon = (props: any) => <FiMessageSquare {...props} />;
const AIIcon = (props: any) => <FiShieldOff {...props} />;