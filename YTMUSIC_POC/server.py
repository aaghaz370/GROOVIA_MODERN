from fastapi import FastAPI, HTTPException, Request, Response, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ytmusicapi import YTMusic
import uvicorn
import asyncio
from concurrent.futures import ThreadPoolExecutor
import time
import logging
import os
import yt_dlp
import httpx

# ─────────────────────────────────────────────────────────────────────────────
# Setup
# ─────────────────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Groovia YTMusic API", version="2.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thread pool — blocking calls (ytmusicapi, yt-dlp)
executor = ThreadPoolExecutor(max_workers=12)

# Initialize YTMusic (unauthenticated — public data)
yt = YTMusic()

# ─────────────────────────────────────────────────────────────────────────────
# Simple in-memory TTL cache
# ─────────────────────────────────────────────────────────────────────────────
_cache: dict = {}
_cache_ts: dict = {}

def cache_get(key: str):
    if key in _cache:
        ttl = _cache_ts[key].get("ttl", 1800)
        if time.time() - _cache_ts[key]["t"] < ttl:
            return _cache[key]
    return None

def cache_set(key: str, value, ttl: int = 1800):
    _cache[key] = value
    _cache_ts[key] = {"t": time.time(), "ttl": ttl}


# ─────────────────────────────────────────────────────────────────────────────
# yt-dlp URL extraction with in-memory cache (~1hr TTL)
# ─────────────────────────────────────────────────────────────────────────────
_stream_cache: dict = {}

def _extract_stream_url(video_id: str) -> dict:
    """
    Extract best audio stream URL using yt-dlp.
    Exact same approach as MUZIFY — proven to work.
    Cached for 1 hour.
    """
    cached = _stream_cache.get(video_id)
    if cached and cached.get("expires_at", 0) > time.time():
        logger.info(f"✅ Stream cache hit: {video_id}")
        return cached

    ydl_opts = {
        "format": "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best",
        "quiet": True,
        "no_warnings": True,
        "socket_timeout": 15,
        "retries": 3,
        "extractor_args": {
            "youtube": {
                # tv_embedded = no age gate, no throttle
                "player_client": ["tv_embedded", "android", "web"],
                "player_skip": ["webpage"],
            }
        },
    }

    # DO NOT use cookies with tv_embedded client, it causes 'app not supported' payload rejection if cookies are stale.
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(
            f"https://music.youtube.com/watch?v={video_id}", download=False
        )

    url = info.get("url")
    if not url:
        for fmt in reversed(info.get("formats", [])):
            if fmt.get("url") and fmt.get("acodec") != "none":
                url = fmt["url"]
                break

    if not url:
        raise ValueError(f"Could not extract stream URL for {video_id}")

    result = {
        "url": url,
        "ext": info.get("ext", "webm"),
        "http_headers": info.get("http_headers", {}),
        "title": info.get("title", video_id),
        "expires_at": time.time() + 3600,  # 1 hour
    }
    _stream_cache[video_id] = result
    logger.info(f"🎵 Extracted for {video_id} [{result['ext']}] → {url[:60]}...")
    return result



# ─────────────────────────────────────────────────────────────────────────────
# Root
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"message": "Groovia YTMusic API v2 is running", "status": "healthy"}


# ─────────────────────────────────────────────────────────────────────────────
# /search
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/search")
async def search(query: str, filter: str = None, limit: int = 20):
    cache_key = f"search:{query}:{filter}:{limit}"
    cached = cache_get(cache_key)
    if cached is not None:
        return {"data": cached, "cached": True}
    try:
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            executor,
            lambda: yt.search(query, filter=filter, limit=limit)
        )
        cache_set(cache_key, results, ttl=1800)
        return {"data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────────────────────
# /watch
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/watch")
async def get_watch_playlist(videoId: str):
    cache_key = f"watch:{videoId}"
    cached = cache_get(cache_key)
    if cached is not None:
        return {"data": cached, "cached": True}
    try:
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(executor, lambda: yt.get_watch_playlist(videoId=videoId))
        cache_set(cache_key, results, ttl=600)
        return {"data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────────────────────
# /album
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/album")
async def get_album(browseId: str):
    cache_key = f"album:{browseId}"
    cached = cache_get(cache_key)
    if cached is not None:
        return {"data": cached, "cached": True}
    try:
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(executor, lambda: yt.get_album(browseId=browseId))
        cache_set(cache_key, results, ttl=3600)
        return {"data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────────────────────
# /prefetch — warm up URL cache before user presses play
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/prefetch")
async def prefetch(videoId: str):
    """Pre-warms the stream URL cache silently in background."""
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(executor, _extract_stream_url, videoId)
        return {"status": "cached", "videoId": videoId}
    except Exception as e:
        logger.warning(f"Prefetch failed for {videoId}: {e}")
        return {"status": "error", "detail": str(e)}


# ─────────────────────────────────────────────────────────────────────────────
# /stream — Main audio streaming endpoint
# Replaces pytubefix with yt-dlp for reliability
# Supports HTTP Range requests (crucial for seek support)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/stream")
async def stream_audio(
    videoId: str,
    range: str = Header(None, alias="range"),
    request_range: str = Query(None),
    download: bool = False,
    title: str = "song"
):
    """
    Proxy-streams audio from YouTube using yt-dlp.
    Exact MUZIFY approach.
    """
    try:
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(executor, _extract_stream_url, videoId)
        url = data["url"]
        http_headers = data.get("http_headers", {})
        ext = data.get("ext", "webm")

        req_headers = {
            "User-Agent": http_headers.get(
                "User-Agent",
                "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/112.0.0.0 Safari/537.36",
            ),
        }
        
        # Pass range if available
        if range:
            req_headers["Range"] = range
        elif request_range:
            req_headers["Range"] = request_range

        content_type_map = {
            "m4a": "audio/mp4",
            "webm": "audio/webm",
            "mp4": "audio/mp4",
            "opus": "audio/ogg",
        }
        content_type = content_type_map.get(ext, "audio/webm")

        import httpx

        async def proxy_stream():
            async with httpx.AsyncClient(timeout=30) as client:
                async with client.stream(
                    "GET", url, headers=req_headers, follow_redirects=True
                ) as resp:
                    async for chunk in resp.aiter_bytes(chunk_size=65536):
                        yield chunk

        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Accept-Ranges": "bytes",
            "Cache-Control": "no-cache",
        }
        
        status_code = 206 if (range or request_range) else 200

        if download:
            safe_title = "".join(c for c in title if c.isalnum() or c in " -_").strip()
            headers["Content-Disposition"] = f'attachment; filename="{safe_title or videoId}.{ext}"'
            headers["Access-Control-Expose-Headers"] = "Content-Disposition"
            status_code = 200  # downloads are usually full files

        return StreamingResponse(
            proxy_stream(),
            status_code=status_code,
            media_type=content_type,
            headers=headers,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Stream failed for {videoId}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────────────────────
# /download — One-click download (same as /stream?download=true but clean URL)
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/download")
async def download_audio(
    videoId: str,
    request: Request,
    response: Response,
    title: str = Query("song", description="Song title for filename"),
):
    """
    One-click audio download. Triggers browser file save dialog.
    """
    return await stream_audio(videoId, request, response, download=True)


# ─────────────────────────────────────────────────────────────────────────────
# /playlist
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/playlist")
async def get_playlist(browseId: str, limit: int = 100):
    cache_key = f"playlist:{browseId}:{limit}"
    cached = cache_get(cache_key)
    if cached is not None:
        return {"data": cached, "cached": True}
    try:
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            executor,
            lambda: yt.get_playlist(playlistId=browseId, limit=limit)
        )
        cache_set(cache_key, results, ttl=1800)
        return {"data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────────────────────
# /lyrics
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/lyrics")
async def get_lyrics(browseId: str):
    cache_key = f"lyrics:{browseId}"
    cached = cache_get(cache_key)
    if cached is not None:
        return {"data": cached, "cached": True}
    try:
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(executor, lambda: yt.get_lyrics(browseId=browseId))
        cache_set(cache_key, results, ttl=86400)
        return {"data": results}
    except Exception as e:
        return {"data": None}


# ─────────────────────────────────────────────────────────────────────────────
# /artist
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/artist")
async def get_artist_data(channelId: str):
    cache_key = f"artist:{channelId}"
    cached = cache_get(cache_key)
    if cached is not None:
        return {"data": cached, "cached": True}
    try:
        loop = asyncio.get_event_loop()
        artist = await loop.run_in_executor(executor, lambda: yt.get_artist(channelId))
        if not artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        cache_set(cache_key, artist, ttl=3600)
        return {"data": artist}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Artist not found: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
# /charts
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/charts")
async def get_charts_data(country: str = "IN"):
    cache_key = f"charts:{country}"
    cached = cache_get(cache_key)
    if cached is not None:
        return {"data": cached, "cached": True}
    try:
        loop = asyncio.get_event_loop()
        charts = await loop.run_in_executor(executor, lambda: yt.get_charts(country=country))

        songs = []
        if charts.get("videos"):
            playlist_id = charts["videos"][0].get("playlistId")
            if playlist_id:
                playlist = await loop.run_in_executor(
                    executor,
                    lambda: yt.get_playlist(playlistId=playlist_id, limit=30)
                )
                tracks = playlist.get("tracks", []) or []
                songs = [t for t in tracks if t.get("videoId")]

        if not songs:
            fallback = await loop.run_in_executor(
                executor,
                lambda: yt.search("India Top Songs Hindi 2025", filter="songs", limit=20)
            )
            songs = [s for s in (fallback or []) if s.get("videoId")]

        result = {"charts": charts, "songs": songs}
        cache_set(cache_key, result, ttl=3600)
        return {"data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)
