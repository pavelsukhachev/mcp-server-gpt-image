import { IImageCache, IImageOptimizer, IOpenAIClient } from '../interfaces/image-generation.interface.js';
import { ImageGenerationInput } from '../types.js';
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
export interface IStreamingImageGenerator {
    generateWithStreaming(input: ImageGenerationInput): AsyncGenerator<StreamingImageEvent, void, unknown>;
}
export declare class StreamingImageGenerator implements IStreamingImageGenerator {
    private openaiClient;
    private cache;
    private optimizer;
    constructor(openaiClient: IOpenAIClient, cache: IImageCache, optimizer: IImageOptimizer);
    generateWithStreaming(input: ImageGenerationInput): AsyncGenerator<StreamingImageEvent, void, unknown>;
    private checkCache;
    private yieldCachedResult;
    private generateImage;
    private yieldPartialImages;
    private processFinalResult;
    private extractImages;
    private shouldOptimize;
    private optimizeImages;
    private createProgressEvent;
    private createPartialEvent;
    private createCompleteEvent;
    private createErrorEvent;
}
//# sourceMappingURL=streaming-image-generator.d.ts.map