import { ImageGenerationInput, ImageEditInput } from '../types.js';
interface OptimizationOptions {
    format?: 'png' | 'jpeg' | 'webp';
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    preserveTransparency?: boolean;
}
export declare class ImageOptimizer {
    /**
     * Optimize a base64-encoded image
     */
    static optimizeBase64(base64Image: string, options?: OptimizationOptions): Promise<string>;
    /**
     * Optimize images based on generation/edit input parameters
     */
    static optimizeForOutput(base64Image: string, input: ImageGenerationInput | ImageEditInput): Promise<string>;
    /**
     * Batch optimize multiple images
     */
    static optimizeBatch(base64Images: string[], input: ImageGenerationInput | ImageEditInput): Promise<string[]>;
    /**
     * Detect optimal format based on image characteristics
     */
    private static detectOptimalFormat;
    /**
     * Map quality setting to numeric value
     */
    private static mapQualityToNumber;
    /**
     * Get default quality for format
     */
    private static getDefaultQuality;
    /**
     * Calculate size reduction percentage
     */
    static calculateSizeReduction(originalBase64: string, optimizedBase64: string): Promise<number>;
}
export {};
//# sourceMappingURL=image-optimizer.d.ts.map