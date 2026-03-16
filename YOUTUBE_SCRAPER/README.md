# YouTube Direct Link Scraper

Extract direct audio/video stream URLs from YouTube videos without yt-dlp.

## Features

- 🎵 **Audio Streams**: Multiple quality options (128kbps, 256kbps, etc.)
- 🎬 **Video Streams**: Progressive and adaptive streams (360p to 1080p+)
- ⚡ **Fast**: Direct URLs, no processing
- 🚀 **Vercel Ready**: Serverless deployment
- 🔒 **CORS Enabled**: Use directly from frontend

## API Endpoints

### 1. Extract All Streams
```
GET /extract/{video_id}
```
Returns all audio and video streams with metadata.

### 2. Get Best Audio
```
GET /audio/{video_id}?quality=high&redirect=false
```
Returns the best audio stream URL.

### 3. Get Best Video
```
GET /video/{video_id}?max_quality=1080p&redirect=false
```
Returns the best video stream URL.

### 4. Proxy Stream
```
GET /stream/{video_id}?quality=high
```
Proxies the audio stream (for CORS compatibility).

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python api.py

# Test
curl http://localhost:8000/extract/dQw4w9WgXcQ
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Response Format

```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    "duration": 212,
    "audio_streams": [
      {
        "url": "https://...",
        "bitrate": "256kbps",
        "codec": "mp4a.40.2",
        "mimeType": "audio/mp4",
        "quality": "high",
        "itag": 140
      }
    ],
    "video_streams": [
      {
        "url": "https://...",
        "quality": "1080p",
        "fps": 30,
        "mimeType": "video/mp4",
        "type": "progressive",
        "itag": 137
      }
    ]
  }
}
```

## Integration with Groovia

Update your frontend to use:
```javascript
// Instead of: /stream?videoId=xxx
// Use: https://your-scraper.vercel.app/stream/{videoId}

const streamUrl = `https://your-scraper.vercel.app/stream/${videoId}`;
const audio = new Audio(streamUrl);
audio.play();
```

## Notes

- URLs expire after ~6 hours (cached for performance)
- Progressive streams include both video and audio
- Adaptive streams are video-only (higher quality)
- Use `/stream` endpoint for audio playback (handles CORS)
