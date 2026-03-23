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
                "player_client": ["web_creator", "web", "android"]
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
            info = ydl.extract_info(url, download=False)
    except Exception as yt_err:
        logger.warning(f"yt-dlp attempt failed: {yt_err}")
        try:
            m_url = f"https://music.youtube.com/watch?v={video_id}"
            with yt_dlp.YoutubeDL(_build_ydl_opts()) as ydl:
                info = ydl.extract_info(m_url, download=False)
        except Exception as e2:
            logger.warning(f"yt-dlp music fallback failed: {e2}")

    # Fallback to Invidious/Piped if yt-dlp fails completely (bot block)
    if not info:
        logger.info(f"Fallback to external Scraper APIs for {video_id} (Bypassing Vercel bot blocks completely)")
        import httpx
        import concurrent.futures
        import time
        from urllib.parse import quote
        
        fallback_data = None
        target_url = f"https://www.youtube.com/watch?v={video_id}"
        
        def fetch_api(source):
            try:
                if source == "oceansaver":
                    # Y2Mate.is & SaveFrom backend
                    base = "https://p.oceansaver.in/ajax/download.php"
                    r = httpx.get(f"{base}?format=mp4&url={quote(target_url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222", timeout=12, verify=False)
                    if r.status_code == 200:
                        d = r.json()
                        if d.get("success") and d.get("id"):
                            tid = d["id"]
                            # Poll progress exactly 3 times (Vercel has 15s limit generally)
                            for _ in range(3):
                                time.sleep(1.5)
                                p = httpx.get(f"https://p.oceansaver.in/ajax/progress.php?id={tid}", timeout=5, verify=False).json()
                                if p.get("success") == 1 and p.get("download_url"):
                                    return ("direct", p["title"], p["download_url"], "video")
                elif source == "vevioz":
                    # Often used by MP3 converter sites
                    r = httpx.get(f"https://api.vevioz.com/api/button/mp4/{video_id}", timeout=10, follow_redirects=True, verify=False)
                    if r.status_code == 200 and "download" in r.text.lower():
                        import re
                        m = re.search(r'href="(https?://[^"]+download[^"]+)"', r.text)
                        if m: return ("direct", f"Video {video_id}", m.group(1), "video")
                elif source == "cobalt_kwiatekm":
                    # Known cobalt instance
                    r = httpx.post("https://cobalt-api.kwiatekm.dev/", headers={"Accept": "application/json"}, json={"url": target_url}, timeout=10, verify=False)
                    if r.status_code == 200:
                        d = r.json()
                        if d.get("url"): return ("direct", f"Video {video_id}", d["url"], "video")
                        if d.get("picker"):
                            for obj in d.get("picker", []):
                                if obj.get("url"): return ("direct", f"Video {video_id}", obj["url"], "video")
                elif source == "cobalt_wuk":
                    r = httpx.post("https://co.wuk.sh/api/json", headers={"Accept": "application/json", "Content-Type": "application/json"}, json={"url": target_url}, timeout=10, verify=False)
                    if r.status_code == 200:
                        d = r.json()
                        if d.get("url"): return ("direct", f"Video {video_id}", d["url"], "video")
            except Exception as e:
                pass
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            sources = ["oceansaver", "vevioz", "cobalt_kwiatekm", "cobalt_wuk"]
            for result in executor.map(fetch_api, sources):
                if result:
                    fallback_data = result
                    break
        
        if not fallback_data:
            raise Exception(f"All scrapers and fallback APIs failed for {video_id}")
            
        _, f_title, f_url, f_type = fallback_data
        
        audio_streams, video_streams = [], []
        
        # We synthesize generic streams from the direct URL (which usually contains both audio/video multiplexed)
        audio_streams.append({
            "url": f_url,
            "bitrate": "128kbps",
            "codec": "mp4a",
            "mimeType": "audio/mp4",
            "quality": "high",
            "itag": "fallback_a",
            "size": 0
        })
        video_streams.append({
            "url": f_url,
            "quality": "720p",
            "fps": 30,
            "mimeType": "video/mp4",
            "type": "progressive",
            "itag": "fallback_v",
            "size": 0
        })

        res = {
            "videoId": video_id,
            "title": f_title,
            "thumbnail": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            "duration": 0,
            "audio_streams": audio_streams,
            "video_streams": video_streams,
        }
        _set_cache(video_id, res)
        logger.info(f"✅ Fast-Scraper API Fallback executed successfully for {video_id}")
        return res

    # Original yt-dlp processing
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
