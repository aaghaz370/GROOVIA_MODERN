'use client';

import { useEffect } from 'react';
import { useYTCacheStore } from '@/store/useYTCacheStore';

export default function YTPrefetcher() {
    useEffect(() => {
        // Trigger prefetching when the app mounts
        useYTCacheStore.getState().prefetchAll();
    }, []);

    return null; // This component doesn't render anything
}
