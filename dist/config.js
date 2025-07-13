export function getConfig() {
    return {
        // API Configuration
        openaiApiKey: process.env.OPENAI_API_KEY,
        apiMode: process.env.API_MODE || 'responses', // Default to responses since it now supports image generation
        responsesModel: process.env.RESPONSES_MODEL || 'gpt-4o',
        // Cache Configuration
        cacheDir: process.env.CACHE_DIR || '.cache/images',
        cacheTTL: parseInt(process.env.CACHE_TTL || '3600', 10),
        cacheMaxSize: parseInt(process.env.CACHE_MAX_SIZE || '100', 10),
        // Server Configuration
        port: parseInt(process.env.PORT || '3000', 10),
        corsOrigin: process.env.CORS_ORIGIN || '*',
        // Feature Flags
        enableConversationContext: process.env.ENABLE_CONVERSATION_CONTEXT !== 'false',
        enableStreaming: process.env.ENABLE_STREAMING !== 'false',
        enableOptimization: process.env.ENABLE_OPTIMIZATION !== 'false',
    };
}
//# sourceMappingURL=config.js.map