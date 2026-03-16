import hrequests
from fake_headers import Headers
import yt_dlp
import json

def test_hrequests(video_id):
    header = Headers(
        browser="chrome",
        os="win",
        headers=True
    ).generate()
    
    with open('cookies.txt', 'r') as f:
        cookie_data = f.read()
    
    # Just try reading via a fast request
    # Since yt-dlp might fail on some hosts
    url = f"https://music.youtube.com/watch?v={video_id}"
    print(url)

test_hrequests('CK5dtbG19mo')
