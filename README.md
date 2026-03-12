# Worktio

<p align="center">
  <img src="https://github.com/Miransas/worktio/blob/main/public/logo.png" alt="Worktio Logo" width="140" />
</p>

<p align="center">
  YouTube → Instagram → Telegram workflow automation
</p>

---
####   auth sistem
```

---

Görünüm böyle olacak:
```
┌─────────────────────────────────────┐
│  Bağlı Hesaplar                     │
│  Platformlarını bağla...            │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🎬 YouTube     [Bağlan]     │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 📸 Instagram   [Bağlan]     │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🐦 Twitter/X   [Bağlan]     │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ ✈️ Telegram    [Bağlan]     │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘

## 🚀 Workflow Automation

Worktio, tek bir içerik akışıyla çoklu platform dağıtımı yapar:

1. **YouTube Trigger**: Yeni video algılanır  
2. **Instagram Prep**: Reels format/caption hazırlanır  
3. **Telegram Publish**: Kanal paylaşımı otomatik yapılır  
4. **Status Tracking**: Job sonucu loglanır (`queued`, `processing`, `success`, `failed`)  

---

## 📊 Analytics

Worktio, workflow performansını izlemek için temel metrikler sunar.

### Takip Edilen Metrikler
- Toplam workflow sayısı
- Başarılı / başarısız job oranı
- Ortalama işlem süresi
- Platform bazlı gönderim başarısı:
  - YouTube fetch success rate
  - Instagram prep success rate
  - Telegram publish success rate

### Event Bazlı Ölçüm
- `workflow_started`
- `youtube_fetched`
- `instagram_prepared`
- `telegram_published`
- `workflow_failed`
- `workflow_completed`

### KPI Örnekleri
- **Completion Rate** = completed / total workflows
- **Failure Rate** = failed / total workflows
- **Avg Processing Time** = total duration / completed workflows

---

## 🔐 Security

- API anahtarları güvenli saklanmalıdır
- Hassas veriler loglara düz metin yazılmamalıdır
- Vault + şifreleme (master password) önerilir