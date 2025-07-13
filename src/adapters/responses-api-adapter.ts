import OpenAI from 'openai';
import { 
  IResponsesAPIClient, 
  ResponsesAPIInput, 
  ResponsesAPIOutput,
  ResponsesStreamEvent 
} from '../interfaces/responses-api.interface.js';

export class ResponsesAPIAdapter implements IResponsesAPIClient {
  private client: OpenAI;

  constructor(apiKey: string | undefined) {
    this.client = new OpenAI({ apiKey });
  }

  async create(params: ResponsesAPIInput): Promise<ResponsesAPIOutput> {
    try {
      // Use the Responses API
      const response = await this.client.responses.create({
        model: params.model,
        input: params.input,
        tools: params.tools,
        tool_choice: params.tool_choice,
        previous_response_id: params.previous_response_id,
        stream: false,
      } as any);

      return this.formatResponse(response);
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw error;
    }
  }

  async *createStream(params: ResponsesAPIInput): AsyncGenerator<ResponsesStreamEvent, void, unknown> {
    try {
      const stream = await this.client.responses.create({
        model: params.model,
        input: params.input,
        tools: params.tools,
        tool_choice: params.tool_choice,
        previous_response_id: params.previous_response_id,
        stream: true,
      } as any) as any;

      for await (const event of stream) {
        // The SDK should emit properly typed events
        if (event.type === 'response.image_generation_call.partial_image') {
          yield {
            type: 'response.image_generation_call.partial_image',
            partial_image_index: event.partial_image_index,
            partial_image_b64: event.partial_image_b64
          };
        } else if (event.type === 'response.content.delta') {
          yield {
            type: 'response.content.delta',
            delta: event.delta
          };
        } else if (event.type === 'response.done') {
          yield { type: 'response.done' };
        }
      }
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw error;
    }
  }

  private formatResponse(response: any): ResponsesAPIOutput {
    // The response should already be in the correct format from the SDK
    return {
      id: response.id,
      output: response.output || [],
      usage: response.usage
    };
  }
}