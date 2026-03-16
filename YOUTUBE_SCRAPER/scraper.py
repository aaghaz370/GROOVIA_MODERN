"""
YouTube Direct Link Scraper
Uses pytubefix to extract direct audio/video stream URLs
"""

from pytubefix import YouTube
from pytubefix.exceptions import RegexMatchError, VideoUnavailable
import logging
from typing import Dict, List, Optional
import time

logger = logging.getLogger(__name__)

# Cache for stream URLs (URLs expire after ~6 hours)
_stream_cache: Dict[str, dict] = {}

def get_cache_key(video_id: str) -> str:
    return f"streams:{video_id}"

def get_cached(video_id: str) -> Optional[dict]:
    key = get_cache_key(video_id)
    if key in _stream_cache:
        cached = _stream_cache[key]
        if cached.get("expires_at", 0) > time.time():
            logger.info(f"Cache hit for {video_id}")
            return cached["data"]
    return None

def set_cache(video_id: str, data: dict, ttl: int = 21600):  # 6 hours
    key = get_cache_key(video_id)
    _stream_cache[key] = {
        "data": data,
        "expires_at": time.time() + ttl
    }

def extract_streams(video_id: str) -> dict:
    """
    Extract all audio and video streams for a YouTube video
    Returns dict with audio_streams and video_streams
    """
    # Check cache first
    cached = get_cached(video_id)
    if cached:
        return cached

    try:
        url = f"https://www.youtube.com/watch?v={video_id}"
        yt = YouTube(url)

        # Get video info
        title = yt.title or "Unknown"
        thumbnail = yt.thumbnail_url or ""
        duration = yt.length or 0

        # Extract audio streams
        audio_streams = []
        audio_only = yt.streams.filter(only_audio=True).order_by('abr').desc()

        for stream in audio_only:
            audio_streams.append({
                "url": stream.url,
                "bitrate": stream.abr or "unknown",
                "codec": stream.audio_codec or "unknown",
                "mimeType": stream.mime_type or "audio/mp4",
                "quality": "high" if stream.abr and int(stream.abr.replace('kbps', '')) >= 128 else "low",
                "itag": stream.itag,
                "size": stream.filesize
            })

        # Extract video streams (progressive + adaptive)
        video_streams = []

        # Progressive streams (video+audio combined)
        progressive = yt.streams.filter(progressive=True).order_by('resolution').desc()
        for stream in progressive:
            video_streams.append({
                "url": stream.url,
                "quality": stream.resolution or "unknown",
                "fps": stream.fps or 30,
                "mimeType": stream.mime_type or "video/mp4",
                "type": "progressive",  # Has both video and audio
                "itag": stream.itag,
                "size": stream.filesize
            })

        # Adaptive streams (video only, higher quality)
        adaptive = yt.streams.filter(adaptive=True, only_video=True).order_by('resolution').desc()
        for stream in adaptive:
            video_streams.append({
                "url": stream.url,
                "quality": stream.resolution or "unknown",
                "fps": stream.fps or 30,
                "mimeType": stream.mime_type or "video/webm",
                "type": "adaptive",  # Video only, needs separate audio
                "itag": stream.itag,
                "size": stream.filesize
            })

        result = {
            "videoId": video_id,
            "title": title,
            "thumbnail": thumbnail,
            "duration": duration,
            "audio_streams": audio_streams[:5],  # Top 5 audio qualities
            "video_streams": video_streams[:8]     # Top 8 video qualities
        }

        # Cache the result
        set_cache(video_id, result)
        logger.info(f"Extracted {len(audio_streams)} audio and {len(video_streams)} video streams for {video_id}")

        return result

    except VideoUnavailable:
        raise Exception(f"Video {video_id} is unavailable")
    except RegexMatchError:
        raise Exception(f"Could not parse video {video_id}")
    except Exception as e:
        logger.error(f"Error extracting streams for {video_id}: {e}")
        raise Exception(f"Failed to extract streams: {str(e)}")

def get_best_audio(video_id: str) -> Optional[dict]:
    """Get the best quality audio stream"""
    try:
        data = extract_streams(video_id)
        if data["audio_streams"]:
            return data["audio_streams"][0]  # Already sorted by bitrate desc
        return None
    except Exception as e:
        logger.error(f"Error getting best audio: {e}")
        return None

def get_best_video(video_id: str, max_quality: str = "1080p") -> Optional[dict]:
    """Get the best quality video stream (progressive preferred)"""
    try:
        data = extract_streams(video_id)
        videos = data["video_streams"]

        # Prefer progressive streams
        progressive = [v for v in videos if v.get("type") == "progressive"]
        if progressive:
            return progressive[0]

        # Fallback to adaptive
        adaptive = [v for v in videos if v.get("type") == "adaptive"]
        if adaptive:
            return adaptive[0]

        return videos[0] if videos else None
    except Exception as e:
        logger.error(f"Error getting best video: {e}")
        return None

def get_audio_by_quality(video_id: str, quality: str = "high") -> Optional[dict]:
    """Get audio by quality preference (high/low)"""
    try:
        data = extract_streams(video_id)
        streams = data["audio_streams"]

        if quality == "high":
            # Return highest bitrate
            return streams[0] if streams else None
        else:
            # Return lowest bitrate
            return streams[-1] if streams else None
    except Exception as e:
        logger.error(f"Error getting audio by quality: {e}")
        return None
