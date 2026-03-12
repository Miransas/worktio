import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface Account {
  id: string;
  platform: string;
  username: string;
  expires_at: number | null;
}

const PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "🎬",
    color: "border-red-500",
    badge: "bg-red-500/10 text-red-400",
    oauth: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    color: "border-pink-500",
    badge: "bg-pink-500/10 text-pink-400",
    oauth: true,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "🐦",
    color: "border-sky-500",
    badge: "bg-sky-500/10 text-sky-400",
    oauth: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "✈️",
    color: "border-blue-500",
    badge: "bg-blue-500/10 text-blue-400",
    oauth: false, // bot token
  },
];

export default async function Settings() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [telegramToken, setTelegramToken] = useState("");
  const [showTelegramInput, setShowTelegramInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    const data = await invoke<Account[]>("get_connected_accounts");
    setAccounts(data);
  }

  async function connect(platformId: string) {
    setError(null);
    setLoading(platformId);
    try {
      if (platformId === "telegram") {
        setShowTelegramInput(true);
        setLoading(null);
        return;
      }
      await invoke("connect_platform", { platform: platformId });
      await loadAccounts();
    } catch (e: any) {
      setError(e.toString());
    } finally {
      setLoading(null);
    }
  }

  async function connectTelegram() {
    if (!telegramToken.trim()) return;
    setLoading("telegram");
    setError(null);
    try {
      await invoke("connect_telegram", { botToken: telegramToken });
      setTelegramToken("");
      setShowTelegramInput(false);
      await loadAccounts();
    } catch (e: any) {
      setError(e.toString());
    } finally {
      setLoading(null);
    }
  }

  async function disconnect(id: string) {
    await invoke("disconnect_account", { id });
    await loadAccounts();
  }

  function getAccount(platformId: string) {
    return accounts.find((a) => a.platform === platformId);
  }
  const navigate = useNavigate();

// connectTelegram ve connect fonksiyonlarının sonuna ekle:
await loadAccounts();
navigate("/collabs/workflows")

  return (
    <div className="min-h-screen bg-[#050508] text-white p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Bağlı Hesaplar</h1>
          <p className="text-neutral-500 mt-1">
            Platformlarını bağla, Worktio gerisini halleder.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 
                          rounded-xl text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Platform Kartları */}
        <div className="space-y-3">
          {PLATFORMS.map((platform) => {
            const account = getAccount(platform.id);
            const isLoading = loading === platform.id;
            const isConnected = !!account;

            return (
              <div
                key={platform.id}
                className={`
                  p-5 rounded-2xl border bg-[#0f0f13]
                  transition-all duration-200
                  ${isConnected ? platform.color : "border-neutral-800"}
                `}
              >
                <div className="flex items-center justify-between">
                  {/* Sol: Platform bilgisi */}
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <div className="font-semibold text-white">
                        {platform.name}
                      </div>
                      {isConnected ? (
                        <div className={`
                          text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block
                          ${platform.badge}
                        `}>
                          @{account.username}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-600 mt-0.5">
                          Bağlı değil
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sağ: Buton */}
                  {isConnected ? (
                    <button
                      onClick={() => disconnect(account.id)}
                      className="text-xs text-neutral-500 hover:text-red-400 
                                 transition-colors px-3 py-1.5 rounded-lg 
                                 hover:bg-red-500/10"
                    >
                      Bağlantıyı Kes
                    </button>
                  ) : (
                    <button
                      onClick={() => connect(platform.id)}
                      disabled={isLoading}
                      className="text-sm font-medium px-4 py-2 rounded-xl 
                                 bg-violet-600 hover:bg-violet-500 
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors"
                    >
                      {isLoading ? "Bekleniyor..." : "Bağlan"}
                    </button>
                  )}
                </div>

                {/* Telegram token input */}
                {platform.id === "telegram" && showTelegramInput && !isConnected && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={telegramToken}
                      onChange={(e) => setTelegramToken(e.target.value)}
                      placeholder="Bot token yapıştır (BotFather'dan al)"
                      className="flex-1 bg-[#171717] border border-neutral-700 
                                 rounded-xl px-4 py-2 text-sm text-white 
                                 placeholder-neutral-600 outline-none 
                                 focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={connectTelegram}
                      disabled={loading === "telegram" || !telegramToken.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 
                                 rounded-xl text-sm font-medium 
                                 disabled:opacity-50 transition-colors"
                    >
                      {loading === "telegram" ? "..." : "Ekle"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bağlı hesap sayısı */}
        {accounts.length > 0 && (
          <p className="text-center text-neutral-600 text-sm mt-8">
            {accounts.length} platform bağlı
          </p>
        )}
      </div>
    </div>
  );
}