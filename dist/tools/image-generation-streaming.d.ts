import { ImageGenerationInput, ImageEditInput, ImageGenerationResult } from '../types.js';
export interface StreamingImageEvent {
    type: 'partial' | 'progress' | 'complete' | 'error';
    data?: {
        partialImage?: string;
        partialImageIndex?: number;
        progress?: number;
        message?: string;
        finalImage?: string;
        revisedPrompt?: string;
    };
    error?: string;
}
export declare function generateImageWithStreaming(input: ImageGenerationInput): AsyncGenerator<StreamingImageEvent, void, unknown>;
export declare function generateImageStandard(input: ImageGenerationInput): Promise<ImageGenerationResult>;
export declare function editImageWithStreaming(input: ImageEditInput): AsyncGenerator<StreamingImageEvent, void, unknown>;
//# sourceMappingURL=image-generation-streaming.d.ts.map