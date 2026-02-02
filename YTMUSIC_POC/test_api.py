from ytmusicapi import YTMusic
import json

def test_api():
    print("Initializing YTMusic...")
    yt = YTMusic()

    # 1. Search
    query = "Oasis Wonderwall"
    print(f"\nSearching for '{query}'...")
    search_results = yt.search(query)
    print(f"Found {len(search_results)} results.")
    if search_results:
        first_result = search_results[0]
        print("First result:", json.dumps(first_result, indent=2))
        
        # 2. Get Watch Playlist (Next Songs)
        if 'videoId' in first_result:
            videoId = first_result['videoId']
            print(f"\nFetching Watch Playlist for videoId: {videoId}...")
            watch_playlist = yt.get_watch_playlist(videoId=videoId)
            print("Watch Playlist (Tracks):")
            songs = watch_playlist.get('tracks', [])
            for i, track in enumerate(songs[:5]):
                print(f"{i+1}. {track.get('title')} - {track.get('artists', [{}])[0].get('name')}")

    # 3. Get Charts
    print("\nFetching Charts...")
    charts = yt.get_charts(country='US')
    print("Top Songs in US:")
    top_songs = charts.get('songs', {}).get('items', [])
    for i, song in enumerate(top_songs[:5]):
        print(f"{i+1}. {song.get('title')} - {song.get('artists', [{}])[0].get('name')}")

if __name__ == "__main__":
    test_api()
