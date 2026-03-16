# Groovia Deployment Guide (v2 — yt-dlp powered)

## 1. Backend Deployment (Render)
Deploy the `YTMUSIC_POC` folder as a Python Web Service.

**Steps:**
1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Web Service**.
4. Connect your repository.
5. **Root Directory**: `GROOVIA/GROOVIA_MODERN/YTMUSIC_POC`
6. **Runtime**: Python 3
7. **Build Command**: `pip install -r requirements.txt`
8. **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
9. Click **Create Web Service**.
10. Once deployed, copy the **URL** (e.g., `https://groovia-backend.onrender.com`).

**requirements.txt contains:**
```
fastapi
uvicorn[standard]
ytmusicapi
yt-dlp        ← NEW: replaces pytubefix (much more reliable)
httpx         ← NEW: for async streaming
```

> **Note:** yt-dlp on Render works without ffmpeg for basic audio streaming.
> URLs are cached in-memory for 50 min so Render free tier won't sleep during playback.

---

## 2. Frontend Deployment (Vercel)
Deploy the `FRONTEND` folder.

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com).
2. **Add New Project** → Select your repository.
3. **Root Directory**: `GROOVIA/GROOVIA_MODERN/FRONTEND`
4. **Framework Preset**: Next.js (Automatic)
5. **Environment Variables**:
   - `NEXT_PUBLIC_YT_API_URL` → Your Render URL (e.g., `https://groovia-backend.onrender.com`)
   - `MONGODB_URI` → Your MongoDB connection string
   - (Any Firebase/Auth env vars you use)
6. Click **Deploy**.

---

## 3. What's New in v2

| Feature | Old (pytubefix) | New (yt-dlp) |
|---------|----------------|--------------|
| Reliability | ❌ Breaks often | ✅ Rock solid |
| Stream speed | Slow | Fast (cached) |
| Download | ✅ Worked | ✅ Works + clean filename |
| Seeking | ✅ Range headers | ✅ Range headers |
| Multi-client fallback | ❌ | ✅ tv_embedded → android → web |
| URL caching | ❌ | ✅ 50 min TTL |

---

## 4. Local Development

### Backend (port 8001 to avoid conflict)
```bash
cd YTMUSIC_POC
venv\Scripts\uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd FRONTEND
npm run dev
```

### .env.local (FRONTEND)
```env
NEXT_PUBLIC_YT_API_URL=http://localhost:8001
MONGODB_URI=your_mongo_url
```

---

## 5. API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /search?query=...&filter=songs` | Search YouTube Music |
| `GET /stream?videoId=...` | Stream audio (proxy) |
| `GET /stream?videoId=...&download=true` | Download as file |
| `GET /download?videoId=...&title=...` | Clean download URL |
| `GET /prefetch?videoId=...` | Pre-cache URL for instant play |
| `GET /watch?videoId=...` | Get related songs |
| `GET /charts?country=IN` | Get charts |
| `GET /artist?channelId=...` | Get artist info |
| `GET /lyrics?browseId=...` | Get lyrics |
