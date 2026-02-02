# Groovia Deployment Guide

## 1. Backend Deployment (Render)
You need to deploy the `YTMUSIC_POC` folder as a Python Web Service.

**Steps:**
1.  Push your code to GitHub.
2.  Go to [Render Dashboard](https://dashboard.render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your repository.
5.  **Root Directory**: `YTMUSIC_POC` (Important!).
6.  **Runtime**: Python 3.
7.  **Build Command**: `pip install -r requirements.txt`. (Render will do this automatically if it sees requirements.txt).
8.  **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`.
9.  Click **Create Web Service**.
10. Once deployed, copy the **URL** (e.g., `https://groovia-backend.onrender.com`).

**Note on yt-dlp:**
The backend uses `yt-dlp` to fetch stream URLs. This usually works on Render without extra setup as `pip install yt-dlp` installs the binary. If you face issues playing songs, you might need to install `ffmpeg` (advanced), but basic streaming usually works without it.

---

## 2. Frontend Deployment (Vercel)
Deploy the `FRONTEND` folder.

**Steps:**
1.  Go to [Vercel Dashboard](https://vercel.com).
2.  **Add New Project**.
3.  Select your repository.
4.  **Root Directory**: `FRONTEND`.
5.  **Framework Preset**: Next.js (Automatic).
6.  **Environment Variables**:
    *   `NEXT_PUBLIC_YT_API_URL`: Paste the Render Backend URL here (e.g., `https://groovia-backend.onrender.com`).
    *   (Add any other env vars like MongoDB URI, Auth secrets you already have).
7.  Click **Deploy**.

## 3. Verification
1.  Open your Vercel URL.
2.  Go to **YT Music** tab.
3.  Search for a song.
4.  If results appear and music plays, everything is connected!

## 4. Local Development
To run locally:
1.  Frontend: `npm run dev`
2.  Backend: `uvicorn server:app --reload --port 8000`
3.  Make sure `.env.local` in Frontend has:
    ```
    NEXT_PUBLIC_YT_API_URL=http://localhost:8000
    ```
