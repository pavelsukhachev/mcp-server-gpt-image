import { IImageCache } from '../interfaces/image-generation.interface.js';
import { ImageGenerationInput, ImageEditInput } from '../types.js';
import { ImageCache } from '../utils/cache.js';
export declare class CacheAdapter implements IImageCache {
    private cache;
    constructor(cache: ImageCache);
    get(type: 'generate' | 'edit', input: ImageGenerationInput | ImageEditInput): Promise<any | null>;
    set(type: 'generate' | 'edit', input: ImageGenerationInput | ImageEditInput, data: any, ttl?: number): Promise<void>;
}
//# sourceMappingURL=cache-adapter.d.ts.map