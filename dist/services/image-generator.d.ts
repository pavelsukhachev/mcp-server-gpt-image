import { IImageGenerator, IImageCache, IImageOptimizer, IOpenAIClient, IFileConverter } from '../interfaces/image-generation.interface.js';
import { ImageGenerationInput, ImageEditInput, ImageGenerationResult } from '../types.js';
import { IConversationContext } from '../interfaces/conversation-context.interface.js';
export declare class ImageGenerator implements IImageGenerator {
    private openaiClient;
    private cache;
    private optimizer;
    private fileConverter;
    private conversationContext?;
    constructor(openaiClient: IOpenAIClient, cache: IImageCache, optimizer: IImageOptimizer, fileConverter: IFileConverter, conversationContext?: IConversationContext | undefined);
    generate(input: ImageGenerationInput): Promise<ImageGenerationResult>;
    edit(input: ImageEditInput): Promise<ImageGenerationResult>;
    private extractImagesFromResponse;
    private optimizeImages;
    private convertImagesToFiles;
    private convertMaskToFile;
}
//# sourceMappingURL=image-generator.d.ts.map