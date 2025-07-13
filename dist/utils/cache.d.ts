import { ImageGenerationInput, ImageEditInput } from '../types.js';
interface CacheOptions {
    cacheDir?: string;
    defaultTTL?: number;
    maxSize?: number;
}
export declare class ImageCache {
    private cacheDir;
    private defaultTTL;
    private maxSize;
    private memoryCache;
    constructor(options?: CacheOptions);
    private initializeCache;
    private generateCacheKey;
    get(type: 'generate' | 'edit', input: ImageGenerationInput | ImageEditInput): Promise<any | null>;
    set(type: 'generate' | 'edit', input: ImageGenerationInput | ImageEditInput, data: any, ttl?: number): Promise<void>;
    private cleanupIfNeeded;
    clear(): Promise<void>;
    getCacheStats(): {
        memoryEntries: number;
        estimatedDiskUsage: string;
    };
}
export declare const imageCache: ImageCache;
export {};
//# sourceMappingURL=cache.d.ts.map