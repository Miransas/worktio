import { BiLock } from "react-icons/bi";

// src/components/AuthScreen.tsx
export const AuthScreen = ({ onUnlock }: any) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center">
      <div className="w-96 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-purple-500/40">
           <BiLock className="text-white w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Worktio Terminal</h2>
        <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest">Sistem Erişimi İçin Şifre Girin</p>
        
        <input 
          type="password" 
          placeholder="Master Key..."
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-purple-400 focus:outline-none focus:border-purple-500/50 transition-all mb-4"
        />
        
        <button 
          onClick={onUnlock}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
        >
          SİSTEMİ BAŞLAT
        </button>
      </div>
    </div>
  );
};