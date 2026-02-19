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
    Extract direct audio stream URL using multiple methods + External API fallback.
    Returns a redirect to the direct Google CDN URL.
    """
    try:
        # Check cache first
        cached = get_cached_url(videoId)
        if cached:
            return RedirectResponse(url=cached)

        url = None
        methods_tried = []

        # 1. yt-dlp Clients
        clients_to_try = [
            {'player_client': ['android'], 'name': 'Android'},
            {'player_client': ['ios'], 'name': 'iOS'},
            {'player_client': ['tv'], 'name': 'TV'},
        ]

        for client in clients_to_try:
            try:
                # print(f"Trying yt-dlp with {client['name']}...") 
                ydl_opts = {
                    'format': 'bestaudio[ext=m4a]/bestaudio/best',
                    'quiet': True,
                    'no_warnings': True,
                    'geo_bypass': True,
                    'nocheckcertificate': True,
                    'source_address': '0.0.0.0',
                    'extractor_args': {'youtube': {'player_client': client['player_client']}}
                }
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(f'https://www.youtube.com/watch?v={videoId}', download=False)
                    url = info.get('url')
                    if not url:
                        formats = info.get('formats', [])
                        audio_formats = [f for f in formats if f.get('acodec') != 'none' and f.get('vcodec') == 'none']
                        if audio_formats:
                            audio_formats.sort(key=lambda f: f.get('abr', 0) or 0, reverse=True)
                            url = audio_formats[0].get('url')
                if url: break
            except Exception as e:
                methods_tried.append(f"yt-dlp-{client['name']}: {str(e)}")

        # 2. pytubefix Fallback
        if not url:
            try:
                # print("Falling back to pytubefix...")
                yt = PytubeYouTube(f'https://www.youtube.com/watch?v={videoId}')
                stream = yt.streams.get_audio_only()
                if stream: url = stream.url
            except Exception as e:
                methods_tried.append(f"pytubefix: {str(e)}")

        # 3. External Piped API Fallback (The "Nuclear Option")
        if not url:
            try:
                # print("Falling back to External Piped API...")
                # List of reliable Piped instances
                piped_instances = [
                    "https://pipedapi.kavin.rocks",
                    "https://api.piped.otter.sh",
                    "https://pipedapi.drgns.space"
                ]
                
                for api_base in piped_instances:
                    try:
                        resp = requests.get(f"{api_base}/streams/{videoId}", timeout=5)
                        if resp.status_code == 200:
                            data = resp.json()
                            audio_streams = data.get('audioStreams', [])
                            if audio_streams:
                                # Get best quality m4a or any audio
                                best_audio = next((s for s in audio_streams if s.get('format') == 'M4A'), audio_streams[0])
                                url = best_audio.get('url')
                                if url: break
                    except:
                        continue
            except Exception as e:
                methods_tried.append(f"external-api: {str(e)}")

        if not url:
            error_msg = f"All methods failed. Details: {'; '.join(methods_tried)}"
            print(error_msg)
            raise Exception(error_msg)

        stream_cache[videoId] = {"url": url, "time": time.time()}
        return RedirectResponse(url=url)

    except Exception as e:
        print(f"Error streaming {videoId}: {e}")
        # Return dummy 404 to prevent frontend spam, or handle gracefully
        raise HTTPException(status_code=500, detail=f"Streaming failed: {str(e)}")


@app.get("/stream-url")
def get_stream_url(videoId: str):
    """
    Same as /stream but returns JSON.
    """
    try:
        cached = get_cached_url(videoId)
        if cached:
            return {"url": cached}

        url = None
        methods_tried = []

        # 1. yt-dlp Clients
        clients_to_try = [
            {'player_client': ['android'], 'name': 'Android'},
            {'player_client': ['ios'], 'name': 'iOS'},
            {'player_client': ['tv'], 'name': 'TV'},
        ]

        for client in clients_to_try:
            try:
                ydl_opts = {
                    'format': 'bestaudio[ext=m4a]/bestaudio/best',
                    'quiet': True,
                    'no_warnings': True,
                    'geo_bypass': True,
                    'nocheckcertificate': True,
                    'source_address': '0.0.0.0',
                    'extractor_args': {'youtube': {'player_client': client['player_client']}}
                }
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(f'https://www.youtube.com/watch?v={videoId}', download=False)
                    url = info.get('url')
                    if not url:
                        formats = info.get('formats', [])
                        audio_formats = [f for f in formats if f.get('acodec') != 'none' and f.get('vcodec') == 'none']
                        if audio_formats:
                            audio_formats.sort(key=lambda f: f.get('abr', 0) or 0, reverse=True)
                            url = audio_formats[0].get('url')
                if url: break
            except Exception as e:
                methods_tried.append(f"yt-dlp-{client['name']}: {str(e)}")

        # 2. pytubefix Fallback
        if not url:
            try:
                yt = PytubeYouTube(f'https://www.youtube.com/watch?v={videoId}')
                stream = yt.streams.get_audio_only()
                if stream: url = stream.url
            except Exception as e:
                methods_tried.append(f"pytubefix: {str(e)}")

        # 3. External Piped API Fallback
        if not url:
            try:
                piped_instances = [
                    "https://pipedapi.kavin.rocks",
                    "https://api.piped.otter.sh",
                    "https://pipedapi.drgns.space"
                ]
                for api_base in piped_instances:
                    try:
                        resp = requests.get(f"{api_base}/streams/{videoId}", timeout=5)
                        if resp.status_code == 200:
                            data = resp.json()
                            audio_streams = data.get('audioStreams', [])
                            if audio_streams:
                                best_audio = next((s for s in audio_streams if s.get('format') == 'M4A'), audio_streams[0])
                                url = best_audio.get('url')
                                if url: break
                    except:
                        continue
            except Exception as e:
                methods_tried.append(f"external-api: {str(e)}")

        if not url:
            raise Exception(f"All methods failed: {methods_tried}")

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
