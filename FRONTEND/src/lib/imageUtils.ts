export const getImageUrl = (image: any): string | null => {
    if (!image) return null;

    // Handle string case (legacy data or simple URLs)
    if (typeof image === 'string') return image;

    // Handle array case (standard API response)
    if (Array.isArray(image)) {
        // Try to get high quality (index 2), then medium (1), then low (0)
        // Adjust indices based on your API structure (usually [150x150, 500x500, 960x960] or similar)
        // We look for the highest available index that exists
        return image[image.length - 1]?.url || image[2]?.url || image[1]?.url || image[0]?.url || null;
    }

    // Handle single object case
    if (typeof image === 'object' && image.url) return image.url;

    return null;
};
