import yt_dlp

ids = ['DRZHVrSmcWU', 'PVDPkS4v8FQ', 'i1o1p_DD6TU']

# Test different client strategies
strategies = [
    {
        'name': 'tv_embedded only',
        'opts': {
            'format': 'bestaudio/best',
            'quiet': True,
            'extractor_args': {'youtube': {'player_client': ['tv_embedded']}}
        }
    },
    {
        'name': 'tv_embedded + web',
        'opts': {
            'format': 'bestaudio/best',
            'quiet': True,
            'extractor_args': {'youtube': {'player_client': ['tv_embedded', 'web']}}
        }
    }
]

for s in strategies:
    print(f"\n=== Strategy: {s['name']} ===")
    for vid in ids:
        try:
            with yt_dlp.YoutubeDL(s['opts']) as ydl:
                info = ydl.extract_info(f'https://www.youtube.com/watch?v={vid}', download=False)
                print(f'  {vid}: OK ext={info.get("ext")} acodec={info.get("acodec")}')
        except Exception as e:
            print(f'  {vid}: ERROR {str(e)[:100]}')
