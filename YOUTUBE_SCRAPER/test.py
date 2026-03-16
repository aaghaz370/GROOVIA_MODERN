# Test script for YouTube Scraper

import requests
import sys

BASE_URL = "http://localhost:8000"

def test_extract(video_id):
    """Test extract endpoint"""
    print(f"\n🎵 Testing extract for: {video_id}")
    response = requests.get(f"{BASE_URL}/extract/{video_id}")
    if response.status_code == 200:
        data = response.json()
        if data.get("success"):
            print(f"✅ Title: {data['data']['title']}")
            print(f"✅ Duration: {data['data']['duration']}s")
            print(f"✅ Audio streams: {len(data['data']['audio_streams'])}")
            print(f"✅ Video streams: {len(data['data']['video_streams'])}")
            return True
    print(f"❌ Failed: {response.text}")
    return False

def test_audio(video_id):
    """Test audio endpoint"""
    print(f"\n🎧 Testing audio for: {video_id}")
    response = requests.get(f"{BASE_URL}/audio/{video_id}")
    if response.status_code == 200:
        data = response.json()
        if data.get("success"):
            print(f"✅ Bitrate: {data['data']['bitrate']}")
            print(f"✅ URL length: {len(data['data']['url'])} chars")
            return True
    print(f"❌ Failed: {response.text}")
    return False

def test_video(video_id):
    """Test video endpoint"""
    print(f"\n🎬 Testing video for: {video_id}")
    response = requests.get(f"{BASE_URL}/video/{video_id}")
    if response.status_code == 200:
        data = response.json()
        if data.get("success"):
            print(f"✅ Quality: {data['data']['quality']}")
            print(f"✅ Type: {data['data']['type']}")
            return True
    print(f"❌ Failed: {response.text}")
    return False

if __name__ == "__main__":
    video_id = sys.argv[1] if len(sys.argv) > 1 else "dQw4w9WgXcQ"

    print("=" * 50)
    print("YouTube Scraper Test")
    print("=" * 50)

    # Run tests
    results = []
    results.append(("Extract", test_extract(video_id)))
    results.append(("Audio", test_audio(video_id)))
    results.append(("Video", test_video(video_id)))

    # Summary
    print("\n" + "=" * 50)
    print("Test Summary")
    print("=" * 50)
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{name}: {status}")

    passed = sum(1 for _, p in results if p)
    print(f"\nTotal: {passed}/{len(results)} tests passed")
