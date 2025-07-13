import { ImageGenerationInput, ImageEditInput } from '../types.js';

export interface ImageGenerationTool {
  type: 'image_generation';
  // Optional parameters for image generation
  size?: string;
  quality?: string;
  format?: string;
  background?: string;
  compression?: number;
  partial_images?: number;
}

export interface ImageGenerationCall {
  id: string;
  type: 'image_generation_call';
  status: 'completed';
  revised_prompt?: string;
  result: string; // base64 encoded image
}

export interface ResponsesAPIInput {
  model: string;
  input: string | Array<{
    role?: string;
    content?: Array<{
      type: 'input_text' | 'input_image';
      text?: string;
      image?: string;
    }>;
    type?: 'image_generation_call';
    id?: string;
  }>;
  tools?: ImageGenerationTool[];
  tool_choice?: { type: 'image_generation' };
  previous_response_id?: string;
  stream?: boolean;
}

export interface ResponsesAPIOutput {
  id: string;
  output: Array<{
    type: 'text' | 'image_generation_call';
    text?: string;
    id?: string;
    status?: 'completed';
    revised_prompt?: string;
    result?: string;
  }>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}

export interface ResponsesStreamEvent {
  type: 'response.image_generation_call.partial_image' | 'response.done' | 'response.content.delta';
  partial_image_index?: number;
  partial_image_b64?: string;
  delta?: string;
}

export interface IResponsesAPIClient {
  create(params: ResponsesAPIInput): Promise<ResponsesAPIOutput>;
  createStream(params: ResponsesAPIInput): AsyncGenerator<ResponsesStreamEvent, void, unknown>;
}

export interface IResponsesImageGenerator {
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