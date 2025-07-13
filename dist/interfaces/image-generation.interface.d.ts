import { ImageGenerationInput, ImageEditInput, ImageGenerationResult } from '../types.js';
export interface IImageGenerator {
    generate(input: ImageGenerationInput): Promise<ImageGenerationResult>;
    edit(input: ImageEditInput): Promise<ImageGenerationResult>;
}
export interface IImageCache {
    get(type: 'generate' | 'edit', input: ImageGenerationInput | ImageEditInput): Promise<any | null>;
    set(type: 'generate' | 'edit', input: ImageGenerationInput | ImageEditInput, data: any, ttl?: number): Promise<void>;
}
export interface IImageOptimizer {
    optimizeBatch(images: string[], input: ImageGenerationInput | ImageEditInput): Promise<string[]>;
    calculateSizeReduction(originalBase64: string, optimizedBase64: string): Promise<number>;
}
export interface IOpenAIClient {
    generateImage(params: {
        model: string;
        prompt: string;
        size?: string;
        quality?: string;
        n?: number;
    }): Promise<{
        data?: Array<{
            b64_json?: string;
            url?: string;
            revised_prompt?: string;
        }>;
    }>;
    editImage(params: {
        model: string;
        image: File;
        prompt: string;
        mask?: File;
        size?: string;
        n?: number;
    }): Promise<{
        data?: Array<{
            b64_json?: string;
            url?: string;
            revised_prompt?: string;
        }>;
    }>;
}
export interface IFileConverter {
    base64ToFile(base64: string, filename: string, mimeType: string): File;
    extractBase64FromDataUrl(dataUrl: string): string;
}
//# sourceMappingURL=image-generation.interface.d.ts.map