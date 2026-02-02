'use client';

import { useState, useEffect, useRef } from 'react';
import { BiPlay, BiDotsVerticalRounded, BiMusic } from 'react-icons/bi';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import he from 'he';

interface QuickPicksProps {
    onPlay: (videoId: string) => void;
}

const QuickPicks = ({ onPlay }: QuickPicksProps) => {
    const [songs, setSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch diverse songs to simulate Quick Picks
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                // Fetching distinct queries to build a "Quick Pick" grid
                // This simulates "Start Radio" or "Recommended" content
                const queries = ['Latest English Hits', 'Trending Music', 'Viral Songs', 'New Music Mix'];
                const randomQuery = queries[Math.floor(Math.random() * queries.length)];

                const res = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(randomQuery)}`);
                const data = await res.json();

                // Filter only songs/videos
                const validSongs = (data.data || []).filter((item: any) => item.videoId);
                // Ensure we have 16 items for the grid (4x4) styling matches TrendingOnSocials
                setSongs(validSongs.slice(0, 16));
            } catch (err) {
                console.error("Error fetching Quick Picks:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 600;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Fallback Image Handler
    const handleImageError = (e: any) => {
        const img = e.target;
        const parent = img.parentElement;
        if (parent) {
            const fallback = parent.querySelector('.fallback-icon') as HTMLElement;
            if (fallback) {
                img.style.display = 'none';
                fallback.style.display = 'flex';
            }
        }
    };

    if (loading) return <SkeletonLoader />;

    // If no songs found, return nothing or skeleton? Return nothing to avoid broken UI.
    if (songs.length === 0) return null;

    return (
        <div className="relative py-6 px-4 md:px-8">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">START RADIO FROM A SONG</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Quick Picks</h2>
                </div>

                {/* Nav Arrows - Desktop Only */}
                <div className="hidden md:flex gap-2">
                    <button onClick={() => handleScroll('left')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5">
                        <IoChevronBack size={22} />
                    </button>
                    <button onClick={() => handleScroll('right')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5">
                        <IoChevronForward size={22} />
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div
                ref={scrollRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
            >
                {/* Grid Layout: 4 Rows. 
                     Mobile: auto-cols-[85%] for peek effect.
                     Desktop: auto-cols-[30%] or [24%] for density.
                 */}
                <div className="inline-grid grid-rows-4 grid-flow-col gap-x-6 gap-y-3 auto-cols-[85%] md:auto-cols-[33%] lg:auto-cols-[24%]">
                    {songs.map((song, idx) => (
                        <div
                            key={`${song.videoId}-${idx}`}
                            onClick={() => onPlay(song.videoId)}
                            className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group select-none"
                        >
                            {/* Thumb */}
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-zinc-800 shadow-lg">
                                {song.thumbnails?.[0]?.url ? (
                                    <img
                                        src={song.thumbnails[0].url}
                                        alt={song.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={handleImageError}
                                    />
                                ) : null}

                                {/* Fallback Icon (Starts Hidden) */}
                                <div className={`fallback-icon absolute inset-0 bg-zinc-800 flex items-center justify-center ${song.thumbnails?.[0]?.url ? 'hidden' : 'flex'}`}>
                                    <BiMusic className="text-gray-500" size={24} />
                                </div>

                                {/* Hover Play Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                    <BiPlay className="text-white drop-shadow-md" size={32} />
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                                <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug group-hover:text-purple-400 transition-colors" title={song.title}>
                                    {he.decode(song.title || 'Unknown Track')}
                                </h3>
                                <p className="text-gray-400 text-xs line-clamp-1 font-medium">
                                    {song.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist'}
                                </p>
                            </div>

                            {/* Menu Button */}
                            <button
                                className="text-gray-500 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); }}
                            >
                                <BiDotsVerticalRounded size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const SkeletonLoader = () => (
    <div className="px-4 py-6 md:px-8">
        <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-10 w-48 bg-white/10 rounded mb-8 animate-pulse" />
        <div className="grid grid-rows-4 grid-flow-col gap-4 overflow-hidden">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="flex gap-3 w-[80vw] md:w-[300px]">
                    <div className="w-16 h-16 bg-white/5 rounded-md animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2 py-3">
                        <div className="h-4 bg-white/5 rounded w-[70%] animate-pulse" />
                        <div className="h-3 bg-white/5 rounded w-[40%] animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default QuickPicks;
