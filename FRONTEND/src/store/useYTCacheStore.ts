import { create } from 'zustand';

interface YTCacheState {
    quickPicks: any[];
    albumsForYou: any[];
    longListening: any[];
    featuredPlaylists: any[];
    trendingCharts: any[]; // <-- new
    isPrefetching: boolean;
    hasPrefetched: boolean;
    prefetchAll: () => Promise<void>;
}

export const useYTCacheStore = create<YTCacheState>((set, get) => ({
    quickPicks: [],
    albumsForYou: [],
    longListening: [],
    featuredPlaylists: [],
    trendingCharts: [],
    isPrefetching: false,
    hasPrefetched: false,

    prefetchAll: async () => {
        const state = get();
        if (state.hasPrefetched || state.isPrefetching) return;

        set({ isPrefetching: true });

        const apiUrl = process.env.NEXT_PUBLIC_YT_API_URL || 'http://localhost:8000';

        try {
            // 1. Quick Picks
            const qpQueries = ['Bollywood Top 50', 'Arijit Singh Best', 'Global Top 50', 'Trending Reels', 'Punjabi Top Hits'];
            const qpPromise = Promise.all(
                qpQueries.map(q =>
                    fetch(`${apiUrl}/search?query=${encodeURIComponent(q)}&filter=songs&limit=10`)
                        .then(res => res.json())
                        .then(data => data.data || [])
                        .catch(() => [])
                )
            ).then(results => {
                const allSongs = results.flat();
                const uniqueSongsMap = new Map();
                allSongs.forEach((item: any) => {
                    if (item.videoId) uniqueSongsMap.set(item.videoId, item);
                });
                const uniqueSongs = Array.from(uniqueSongsMap.values());
                return uniqueSongs.sort(() => 0.5 - Math.random()).slice(0, 16);
            });

            // 2. Albums For You
            const afyQueries = ['Bollywood Hit Albums', 'Arijit Singh Best Albums', 'Latest Hindi Albums', 'Top Global Albums', 'Lofi Hip Hop Albums'];
            const afyPromise = Promise.all(
                afyQueries.map(q =>
                    fetch(`${apiUrl}/search?query=${encodeURIComponent(q)}&filter=albums&limit=10`)
                        .then(res => res.json())
                        .then(data => data.data || [])
                        .catch(() => [])
                )
            ).then(results => {
                const allAlbums = results.flat();
                const unique = Array.from(new Map(allAlbums.map((item: any) => [item.browseId, item])).values());
                return unique.sort(() => 0.5 - Math.random()).slice(0, 15);
            });

            // 3. Long Listening
            const llQueries = ['Bollywood Mashup 2024', 'Hindi Nonstop Jukebox', 'Best of Arijit Singh Jukebox', 'Lofi Hindi Mashup'];
            const llPromise = Promise.all(
                llQueries.map(q =>
                    fetch(`${apiUrl}/search?query=${encodeURIComponent(q)}&filter=videos&limit=10`)
                        .then(res => res.json())
                        .then(data => data.data || [])
                        .catch(() => [])
                )
            ).then(results => {
                const allItems = results.flat();
                const uniqueItems = Array.from(new Map(allItems.map((item: any) => [item.videoId, item])).values());
                const longItems = uniqueItems.filter((item: any) => {
                    if (!item.duration || !item.videoId) return false;
                    const parts = item.duration.split(':').map(Number);
                    let seconds = 0;
                    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                    else if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
                    else return false;
                    return seconds > 180;
                });
                return longItems.sort(() => 0.5 - Math.random()).slice(0, 16);
            });

            // 4. Featured Playlists
            const fpQueries = ['Top Hindi Playlist', 'Romantic Bollywood Playlist', 'Party Hits Hindi Playlist', 'Workout Hindi Songs Playlist', 'Travel India Playlist', 'Focus Lofi Hindi', '90s Bollywood Hits'];
            const fpPromise = Promise.all(
                fpQueries.map(q =>
                    fetch(`${apiUrl}/search?query=${encodeURIComponent(q)}&filter=playlists&limit=10`)
                        .then(res => res.json())
                        .then(data => data.data || [])
                        .catch(() => [])
                )
            ).then(results => {
                const allItems = results.flat();
                const unique = Array.from(new Map(allItems.map((item: any) => [item.browseId, item])).values());
                return unique.sort(() => 0.5 - Math.random()).slice(0, 10);
            });

            // 5. Trending Charts (India)
            const chartsPromise = fetch(`${apiUrl}/charts?country=IN`)
                .then(res => res.json())
                .then(data => {
                    const songs = data?.data?.songs || [];
                    // Normalize track format from playlist (has .title/.videoId/.thumbnails/.artists)
                    return songs.slice(0, 20).map((t: any) => ({
                        videoId: t.videoId,
                        title: t.title,
                        thumbnails: t.thumbnails || [],
                        artists: t.artists || [],
                        album: t.album || null,
                        duration: t.duration || '',
                    }));
                })
                .catch(() => []);

            // Await all and update state
            const [quickPicks, albumsForYou, longListening, featuredPlaylists, trendingCharts] = await Promise.all([
                qpPromise, afyPromise, llPromise, fpPromise, chartsPromise
            ]);

            set({
                quickPicks,
                albumsForYou,
                longListening,
                featuredPlaylists,
                trendingCharts,
                isPrefetching: false,
                hasPrefetched: true
            });
        } catch (error) {
            console.error('Error prefetching YT Music data:', error);
            set({ isPrefetching: false, hasPrefetched: true });
        }
    }
}));
