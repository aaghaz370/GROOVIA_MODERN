export const getImageUrl = (image: any, quality: 'low' | 'medium' | 'high' | '500x500' = 'high'): string | null => {
    if (!image) return null;

    // Map 500x500 to high
    if (quality === '500x500') quality = 'high';

    // Helper to extract URL from image item (handles both 'url' and 'link' properties)
    const extractUrl = (item: any): string | null => {
        if (!item) return null;
        if (typeof item === 'string') return item;
        return item.url || item.link || item.src || null;
    };

    // Handle string case (legacy data or simple URLs)
    if (typeof image === 'string') {
        if (quality === 'high') {
            return image.replace('50x50', '500x500').replace('150x150', '500x500');
        }
        if (quality === 'medium') {
            return image.replace('50x50', '150x150').replace('500x500', '150x150');
        }
        return image;
    }

    // Handle array case (standard API response)
    if (Array.isArray(image)) {
        if (image.length === 0) return null;

        // Saavn usually provides sorted sizes: 50x50, 150x150, 500x500
        // Try to extract URLs handling both 'url' and 'link' property names

        if (quality === 'low') {
            // Use lowest quality (50x50), adequate for very small icons
            return extractUrl(image[0]) || extractUrl(image[1]) || extractUrl(image[image.length - 1]);
        }

        if (quality === 'medium') {
            // Use medium quality (150x150), perfect for list items and cards
            return extractUrl(image[1]) || extractUrl(image[0]) || extractUrl(image[image.length - 1]);
        }

        // High quality (default) - Aim for index 2 (500x500) or highest available
        return extractUrl(image[image.length - 1]) || extractUrl(image[2]) || extractUrl(image[1]) || extractUrl(image[0]);
    }

    // Handle single object case
    if (typeof image === 'object') {
        return extractUrl(image);
    }

    return null;
};
