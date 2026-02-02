'use client';

import QuickPicks from '@/components/yt-music/QuickPicks';
import AlbumsForYou from '@/components/yt-music/AlbumsForYou';
import LongListening from '@/components/yt-music/LongListening';
import FeaturedPlaylists from '@/components/yt-music/FeaturedPlaylists';

export default function YTMusicPage() {
    return (
        <div className="min-h-screen pb-32">
            {/* Section 1: Quick Picks */}
            <QuickPicks />

            {/* Section 2: Albums for You */}
            <AlbumsForYou />

            {/* Section 3: Long Listening */}
            <LongListening />

            {/* Section 4: Featured Playlists */}
            <FeaturedPlaylists />
        </div>
    );
}
