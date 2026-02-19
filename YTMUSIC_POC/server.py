from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from ytmusicapi import YTMusic
import yt_dlp
import uvicorn
import time

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize YTMusic (public, no auth needed)
yt = YTMusic()

# Simple in-memory cache for stream URLs (avoid re-extraction)
# YouTube URLs expire after ~6 hours, so we cache for 4 hours max
stream_cache: dict[str, dict] = {}
CACHE_TTL = 4 * 60 * 60  # 4 hours in seconds


def get_cached_url(video_id: str) -> str | None:
    """Get cached stream URL if still valid."""
    if video_id in stream_cache:
        entry = stream_cache[video_id]
        if time.time() - entry["time"] < CACHE_TTL:
            return entry["url"]
        else:
            del stream_cache[video_id]
    return None


@app.get("/")
def read_root():
    return {"message": "Groovia YTMusic API Proxy is running"}


@app.get("/search")
def search(query: str, filter: str = None, limit: int = 20):
    try:
        results = yt.search(query, filter=filter, limit=limit)
        return {"data": results}
    except Exception as e:
        print(f"Search error (query={query}, filter={filter}): {e}")
        # Return empty data instead of 500 — graceful degradation
        return {"data": []}


@app.get("/watch")
def get_watch_playlist(videoId: str):
    try:
        results = yt.get_watch_playlist(videoId=videoId)
        return {"data": results}
    except Exception as e:
        print(f"Error getting watch playlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/album")
def get_album(browseId: str):
    try:
        results = yt.get_album(browseId=browseId)
        return {"data": results}
    except Exception as e:
        print(f"Error getting album: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stream")
def stream_audio(videoId: str):
    """
    Extract direct audio stream URL using yt-dlp Python API.
    Returns a redirect to the direct Google CDN URL.
    Supports geo-restricted and regional content (Pakistani, etc.)
    """
    try:
        # Check cache first
        cached = get_cached_url(videoId)
        if cached:
            return RedirectResponse(url=cached)

        ydl_opts = {
            'format': 'bestaudio[ext=m4a]/bestaudio/best',
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'geo_bypass': True,  # Bypass geo-restrictions (Pakistani songs etc.)
            'nocheckcertificate': True,
            'socket_timeout': 30,
            'retries': 3,
            'source_address': '0.0.0.0',  # Bind to IPv4
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f'https://www.youtube.com/watch?v={videoId}',
                download=False
            )
            url = info.get('url')

            if not url:
                # Sometimes url is in formats list
                formats = info.get('formats', [])
                # Find best audio format
                audio_formats = [f for f in formats if f.get('acodec') != 'none' and f.get('vcodec') == 'none']
                if audio_formats:
                    # Sort by audio bitrate (highest first)
                    audio_formats.sort(key=lambda f: f.get('abr', 0) or 0, reverse=True)
                    url = audio_formats[0].get('url')
                elif formats:
                    # Fallback: use any format with audio
                    for f in reversed(formats):
                        if f.get('acodec') != 'none' and f.get('url'):
                            url = f['url']
                            break

            if not url:
                raise Exception("No playable URL found")

            # Cache the URL
            stream_cache[videoId] = {"url": url, "time": time.time()}

            return RedirectResponse(url=url)

    except Exception as e:
        print(f"Error streaming {videoId}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stream-url")
def get_stream_url(videoId: str):
    """
    Same as /stream but returns JSON instead of redirect.
    Useful for frontend to get the URL directly.
    """
    try:
        cached = get_cached_url(videoId)
        if cached:
            return {"url": cached}

        ydl_opts = {
            'format': 'bestaudio[ext=m4a]/bestaudio/best',
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'geo_bypass': True,
            'nocheckcertificate': True,
            'socket_timeout': 30,
            'retries': 3,
            'source_address': '0.0.0.0',
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f'https://www.youtube.com/watch?v={videoId}',
                download=False
            )
            url = info.get('url')

            if not url:
                formats = info.get('formats', [])
                audio_formats = [f for f in formats if f.get('acodec') != 'none' and f.get('vcodec') == 'none']
                if audio_formats:
                    audio_formats.sort(key=lambda f: f.get('abr', 0) or 0, reverse=True)
                    url = audio_formats[0].get('url')
                elif formats:
                    for f in reversed(formats):
                        if f.get('acodec') != 'none' and f.get('url'):
                            url = f['url']
                            break

            if not url:
                raise Exception("No playable URL found")

            stream_cache[videoId] = {"url": url, "time": time.time()}
            return {"url": url}

    except Exception as e:
        print(f"Error getting stream URL for {videoId}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/playlist")
def get_playlist(browseId: str, limit: int = 100):
    try:
        results = yt.get_playlist(playlistId=browseId, limit=limit)
        return {"data": results}
    except Exception as e:
        print(f"Error getting playlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/lyrics")
def get_lyrics(browseId: str):
    try:
        results = yt.get_lyrics(browseId=browseId)
        return {"data": results}
    except Exception as e:
        print(f"Error getting lyrics: {e}")
        return {"data": None}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
