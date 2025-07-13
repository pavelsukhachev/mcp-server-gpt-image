export interface ServerConfig {
    openaiApiKey?: string;
    apiMode: 'images' | 'responses';
    responsesModel?: string;
    cacheDir: string;
    cacheTTL: number;
    cacheMaxSize: number;
    port: number;
    corsOrigin: string;
    enableConversationContext: boolean;
    enableStreaming: boolean;
    enableOptimization: boolean;
}
export declare function getConfig(): ServerConfig;
//# sourceMappingURL=config.d.ts.map