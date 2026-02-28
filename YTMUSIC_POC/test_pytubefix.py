from pytubefix import YouTube

# Trying out pytubefix with Android Music client
try:
    yt = YouTube('https://www.youtube.com/watch?v=PVDPkS4v8FQ', client='ANDROID_MUSIC')
    audio = yt.streams.get_audio_only()
    print("SUCCESS: Stream URL length =", len(audio.url))
    print("Mimetype:", audio.mime_type)
    print("Title:", yt.title)
except Exception as e:
    print("ERROR:", e)
