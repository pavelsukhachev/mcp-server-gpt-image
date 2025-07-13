import { IResponsesImageGenerator, IResponsesAPIClient } from '../interfaces/responses-api.interface.js';
import { IImageCache, IImageOptimizer, IFileConverter } from '../interfaces/image-generation.interface.js';
import { IConversationContext } from '../interfaces/conversation-context.interface.js';
import { ImageGenerationInput, ImageEditInput } from '../types.js';
export declare class ResponsesImageGenerator implements IResponsesImageGenerator {
    private responsesClient;
    private cache;
    private optimizer;
    private fileConverter;
    private conversationContext?;
    private model;
    constructor(responsesClient: IResponsesAPIClient, cache: IImageCache, optimizer: IImageOptimizer, fileConverter: IFileConverter, conversationContext?: IConversationContext | undefined);
    generate(input: ImageGenerationInput): Promise<{
        images: string[];
        revised_prompt?: string;
        response_id?: string;
    }>;
    edit(input: ImageEditInput): Promise<{
        images: string[];
        revised_prompt?: string;
        response_id?: string;
    }>;
    generateWithStreaming(input: ImageGenerationInput): AsyncGenerator<{
        type: 'partial' | 'complete' | 'progress';
        data: {
            partialImage?: string;
            index?: number;
            finalImage?: string;
            revisedPrompt?: string;
            message?: string;
            percentage?: number;
        };
    }, void, unknown>;
}
//# sourceMappingURL=responses-image-generator.d.ts.map