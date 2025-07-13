import { ImageGenerationInput, ImageEditInput, ImageGenerationResult } from '../types.js';
export declare function generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult>;
export declare function editImage(input: ImageEditInput): Promise<ImageGenerationResult>;
export declare function generateImageWithStreaming(input: ImageGenerationInput): AsyncGenerator<any, void, unknown>;
//# sourceMappingURL=image-generation.d.ts.map