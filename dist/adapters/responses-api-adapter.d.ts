import { IResponsesAPIClient, ResponsesAPIInput, ResponsesAPIOutput, ResponsesStreamEvent } from '../interfaces/responses-api.interface.js';
export declare class ResponsesAPIAdapter implements IResponsesAPIClient {
    private client;
    constructor(apiKey: string | undefined);
    create(params: ResponsesAPIInput): Promise<ResponsesAPIOutput>;
    createStream(params: ResponsesAPIInput): AsyncGenerator<ResponsesStreamEvent, void, unknown>;
    private formatResponse;
}
//# sourceMappingURL=responses-api-adapter.d.ts.map