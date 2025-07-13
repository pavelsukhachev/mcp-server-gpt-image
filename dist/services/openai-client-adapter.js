import OpenAI from 'openai';
export class OpenAIClientAdapter {
    client;
    constructor(apiKey) {
        this.client = new OpenAI({ apiKey });
    }
    async generateImage(params) {
        try {
            const response = await this.client.images.generate({
                model: params.model,
                prompt: params.prompt,
                size: params.size,
                quality: params.quality,
                n: params.n,
            });
            return response;
        }
        catch (error) {
            if (error instanceof OpenAI.APIError) {
                throw new Error(`OpenAI API error: ${error.message}`);
            }
            throw error;
        }
    }
    async editImage(params) {
        try {
            const response = await this.client.images.edit({
                model: params.model,
                image: params.image,
                prompt: params.prompt,
                mask: params.mask,
                size: params.size,
                n: params.n,
            });
            return response;
        }
        catch (error) {
            if (error instanceof OpenAI.APIError) {
                throw new Error(`OpenAI API error: ${error.message}`);
            }
            throw error;
        }
    }
}
//# sourceMappingURL=openai-client-adapter.js.map