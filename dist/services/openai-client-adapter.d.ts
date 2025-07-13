import { IOpenAIClient } from '../interfaces/image-generation.interface.js';
export declare class OpenAIClientAdapter implements IOpenAIClient {
    private client;
    constructor(apiKey: string | undefined);
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
//# sourceMappingURL=openai-client-adapter.d.ts.map