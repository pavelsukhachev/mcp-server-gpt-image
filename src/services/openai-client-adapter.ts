import OpenAI from 'openai';
import { IOpenAIClient } from '../interfaces/image-generation.interface.js';

export class OpenAIClientAdapter implements IOpenAIClient {
  private client: OpenAI;

  constructor(apiKey: string | undefined) {
    this.client = new OpenAI({ apiKey });
  }

  async generateImage(params: {
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
  }> {
    try {
      const response = await this.client.images.generate({
        model: params.model,
        prompt: params.prompt,
        size: params.size as any,
        quality: params.quality as any,
        n: params.n,
      });

      return response;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw error;
    }
  }

  async editImage(params: {
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
  }> {
    try {
      const response = await this.client.images.edit({
        model: params.model,
        image: params.image,
        prompt: params.prompt,
        mask: params.mask,
        size: params.size as any,
        n: params.n,
      });

      return response;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw error;
    }
  }
}