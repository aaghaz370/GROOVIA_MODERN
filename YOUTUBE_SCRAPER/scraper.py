"""
YouTube Direct Link Scraper (yt-dlp)
Properly handles Vercel read-only filesystem and cookies.
"""

import yt_dlp
import logging
import time
import os
import base64
import shutil
from typing import Dict, Optional

logger = logging.getLogger(__name__)

# ── In-memory URL cache (~50 min TTL) ────────────────────────────────────────
_stream_cache: Dict[str, dict] = {}
_CACHE_TTL = 3000

import tempfile

_TMP_DIR = os.path.join(tempfile.gettempdir(), "yt_scraper")
_COOKIES_PATH = os.path.join(_TMP_DIR, "yt_cookies.txt")

# Ensure /tmp/yt_scraper exists and is writable
os.makedirs(_TMP_DIR, exist_ok=True)

def _setup_cookies() -> Optional[str]:
    # 1. Try env var (base64-encoded)
    cookies_b64 = os.environ.get("YT_COOKIES_B64", "")
    if cookies_b64:
        try:
            cookies_txt = base64.b64decode(cookies_b64).decode("utf-8")
            with open(_COOKIES_PATH, "w") as f:
                f.write(cookies_txt)
            logger.info("🍪 Decoded YT_COOKIES_B64 to " + _COOKIES_PATH)
            return _COOKIES_PATH
        except Exception as e:
            logger.error(f"❌ Failed to decode ENV cookies: {e}")

    # 2. Try local bundled cookies.txt
    local_dir = os.path.dirname(os.path.abspath(__file__))
    for cookie_file in ["cookies.txt", "../www.youtube.com_cookies (1).txt", "../cookies.txt"]:
        path = os.path.join(local_dir, cookie_file)
        if os.path.exists(path):
            try:
                shutil.copyfile(path, _COOKIES_PATH)
                logger.info(f"🍪 Copied {path} to {_COOKIES_PATH}")
                return _COOKIES_PATH
            except Exception as e:
                logger.error(f"⚠️ Failed to copy {path}: {e}")
                
    return None

_COOKIES_FILE = _setup_cookies()

def _build_ydl_opts(fmt: str = "bestaudio/best") -> dict:
    opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "noplaylist": True,
        "format": fmt,
        "cachedir": _TMP_DIR, # point yt-dlp cache to /tmp
        "extractor_args": {
            "youtube": {
                "player_client": ["android", "web"]
            }
        }
    }
    if _COOKIES_FILE and os.path.exists(_COOKIES_FILE):
        opts["cookiefile"] = _COOKIES_FILE
    return opts

# ── Cache helpers ─────────────────────────────────────────────────────────────
def _get_cached(video_id: str) -> Optional[dict]:
    entry = _stream_cache.get(video_id)
    if entry and entry.get("expires_at", 0) > time.time():
        return entry["data"]
    return None

def _set_cache(video_id: str, data: dict) -> None:
    _stream_cache[video_id] = {
        "data": data,
        "expires_at": time.time() + _CACHE_TTL,
    }

# ── Core extractor ─────────────────────────────────────────────────────────────
def extract_streams(video_id: str) -> dict:
    cached = _get_cached(video_id)
    if cached:
        return cached

    url = f"https://www.youtube.com/watch?v={video_id}"
    
    info = None
    try:
        with yt_dlp.YoutubeDL(_build_ydl_opts()) as ydl:
            # First attempt directly extracting
            info = ydl.extract_info(url, download=False)
    except Exception as e:
        logger.warning(f"yt-dlp first attempt failed: {e}")
        # Try again with music client (often less restricted)
        try:
            m_url = f"https://music.youtube.com/watch?v={video_id}"
            with yt_dlp.YoutubeDL(_build_ydl_opts()) as ydl:
                info = ydl.extract_info(m_url, download=False)
        except Exception as e2:
            raise Exception(f"yt-dlp failed completely for {video_id}: {e2}")
            
    if not info:
        raise Exception("Failed to get info dict from yt-dlp")

    title = info.get("title", "Unknown")
    thumbnail = info.get("thumbnail", "")
    duration = info.get("duration", 0)
    raw_formats = info.get("formats") or []

    # ── Audio streams
    audio_streams = []
    for f in raw_formats:
        if not f or f.get("vcodec") != "none":
            continue
        url_f = f.get("url")
        if not url_f:
            continue
        
        try:
            abr = float(f.get("abr") or 0)
        except (ValueError, TypeError):
            abr = 0
            
        ext = f.get("ext", "webm")
        audio_streams.append({
            "url": url_f,
            "bitrate": f"{int(abr)}kbps" if abr > 0 else "unknown",
            "codec": f.get("acodec", "unknown"),
            "mimeType": f"audio/{ext}",
            "quality": "high" if abr >= 128 else "low",
            "itag": str(f.get("format_id", "")),
            "size": f.get("filesize"),
        })

    # Sort descending by bitrate
    def sort_key(x):
        try:
            return int(x["bitrate"].replace("kbps", ""))
        except (ValueError, KeyError):
            return 0

    audio_streams.sort(key=sort_key, reverse=True)

    # ── Video streams
    video_streams = []
    for f in raw_formats:
        if not f:
            continue
        url_f = f.get("url")
        if not url_f:
            continue
        vcodec = f.get("vcodec", "none")
        acodec = f.get("acodec", "none")
        if vcodec == "none":
            continue  
            
        stream_type = "progressive" if acodec != "none" else "adaptive"
        video_streams.append({
            "url": url_f,
            "quality": str(f.get("resolution") or f.get("height", "unknown")),
            "fps": f.get("fps", 30),
            "mimeType": f"video/{f.get('ext', 'mp4')}",
            "type": stream_type,
            "itag": str(f.get("format_id", "")),
            "size": f.get("filesize"),
        })

    result = {
        "videoId": video_id,
        "title": title,
        "thumbnail": thumbnail,
        "duration": duration,
        "audio_streams": audio_streams[:8],
        "video_streams": video_streams[:8],
    }

    _set_cache(video_id, result)
    logger.info(f"✅ Extracted {len(audio_streams)} audio, {len(video_streams)} video streams")
    return result

def get_best_audio(video_id: str) -> Optional[dict]:
    try:
        data = extract_streams(video_id)
        streams = data["audio_streams"]
        return streams[0] if streams else None
    except Exception as e:
        logger.error(f"get_best_audio failed: {e}")
        return None

def get_best_video(video_id: str, max_quality: str = "1080p") -> Optional[dict]:
    try:
        data = extract_streams(video_id)
        videos = data["video_streams"]
        progressive = [v for v in videos if v.get("type") == "progressive"]
        if progressive:
            return progressive[0]
        adaptive = [v for v in videos if v.get("type") == "adaptive"]
        return adaptive[0] if adaptive else (videos[0] if videos else None)
    except Exception as e:
        logger.error(f"get_best_video failed: {e}")
        return None

def get_audio_by_quality(video_id: str, quality: str = "high") -> Optional[dict]:
    try:
        data = extract_streams(video_id)
        streams = data["audio_streams"]
        if not streams:
            return None
        return streams[0] if quality == "high" else streams[-1]
    except Exception as e:
        logger.error(f"get_audio_by_quality failed: {e}")
        return None
