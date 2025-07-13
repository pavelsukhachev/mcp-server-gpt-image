import { IImageCache } from '../interfaces/image-generation.interface.js';
import { ImageGenerationInput, ImageEditInput } from '../types.js';
import { ImageCache } from '../utils/cache.js';

export class CacheAdapter implements IImageCache {
  constructor(private cache: ImageCache) {}

  async get(
    type: 'generate' | 'edit', 
    input: ImageGenerationInput | ImageEditInput
  ): Promise<any | null> {
    return this.cache.get(type, input);
  }

  async set(
    type: 'generate' | 'edit', 
    input: ImageGenerationInput | ImageEditInput, 
    data: any, 
    ttl?: number
  ): Promise<void> {
    return this.cache.set(type, input, data, ttl);
  }
}