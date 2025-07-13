import { IImageOptimizer } from '../interfaces/image-generation.interface.js';
import { ImageGenerationInput, ImageEditInput } from '../types.js';
export declare class OptimizerAdapter implements IImageOptimizer {
    optimizeBatch(images: string[], input: ImageGenerationInput | ImageEditInput): Promise<string[]>;
    calculateSizeReduction(originalBase64: string, optimizedBase64: string): Promise<number>;
}
//# sourceMappingURL=optimizer-adapter.d.ts.map