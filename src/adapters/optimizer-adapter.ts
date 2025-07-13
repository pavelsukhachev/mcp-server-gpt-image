import { IImageOptimizer } from '../interfaces/image-generation.interface.js';
import { ImageGenerationInput, ImageEditInput } from '../types.js';
import { ImageOptimizer } from '../utils/image-optimizer.js';

export class OptimizerAdapter implements IImageOptimizer {
  async optimizeBatch(
    images: string[], 
    input: ImageGenerationInput | ImageEditInput
  ): Promise<string[]> {
    return ImageOptimizer.optimizeBatch(images, input);
  }

  async calculateSizeReduction(
    originalBase64: string, 
    optimizedBase64: string
  ): Promise<number> {
    return ImageOptimizer.calculateSizeReduction(originalBase64, optimizedBase64);
  }
}