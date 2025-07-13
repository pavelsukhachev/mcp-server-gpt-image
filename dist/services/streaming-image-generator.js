export class StreamingImageGenerator {
    openaiClient;
    cache;
    optimizer;
    constructor(openaiClient, cache, optimizer) {
        this.openaiClient = openaiClient;
        this.cache = cache;
        this.optimizer = optimizer;
    }
    async *generateWithStreaming(input) {
        try {
            // Check cache first
            const cached = await this.checkCache(input);
            if (cached) {
                yield* this.yieldCachedResult(cached);
                return;
            }
            // Emit initial progress
            yield this.createProgressEvent(0, 'Initializing image generation...');
            // Process prompt
            yield this.createProgressEvent(30, 'Processing prompt...');
            // Generate image
            const response = await this.generateImage(input);
            // Emit partial images if requested
            if (input.partialImages) {
                yield* this.yieldPartialImages(input.partialImages, response);
            }
            // Process final image
            yield this.createProgressEvent(90, 'Finalizing image...');
            // Check if optimization is needed
            if (this.shouldOptimize(input)) {
                yield this.createProgressEvent(95, 'Optimizing image...');
            }
            const result = await this.processFinalResult(input, response);
            // Cache result
            await this.cache.set('generate', input, result);
            // Emit complete event
            yield this.createCompleteEvent(result);
        }
        catch (error) {
            yield this.createErrorEvent(error);
        }
    }
    async checkCache(input) {
        return this.cache.get('generate', input);
    }
    async *yieldCachedResult(cached) {
        yield this.createProgressEvent(100, 'Retrieved from cache');
        yield this.createCompleteEvent(cached);
    }
    async generateImage(input) {
        return this.openaiClient.generateImage({
            model: 'gpt-image-1',
            prompt: input.prompt,
            size: !input.size || input.size === 'auto' ? '1024x1024' : input.size,
            quality: input.quality || 'auto',
            n: input.n,
        });
    }
    async *yieldPartialImages(numPartials, response) {
        for (let i = 0; i < numPartials; i++) {
            yield this.createProgressEvent(40 + (i * 15), `Generating partial image ${i + 1}/${numPartials}...`);
            if (response.data?.[0]?.b64_json) {
                yield this.createPartialEvent(response.data[0].b64_json, i);
            }
        }
    }
    async processFinalResult(input, response) {
        const images = this.extractImages(response);
        if (images.length === 0) {
            throw new Error('No images generated');
        }
        let optimizedImages = images;
        if (this.shouldOptimize(input)) {
            optimizedImages = await this.optimizeImages(images, input);
        }
        return {
            images: optimizedImages,
            revised_prompt: response.data?.[0]?.revised_prompt,
        };
    }
    extractImages(response) {
        return response.data?.map((item) => {
            if (item.b64_json) {
                return item.b64_json;
            }
            throw new Error('Invalid response format');
        }) || [];
    }
    shouldOptimize(input) {
        return input.output_compression !== undefined || input.format !== 'png';
    }
    async optimizeImages(images, input) {
        const optimized = await this.optimizer.optimizeBatch(images, input);
        if (images.length > 0 && optimized.length > 0) {
            const reduction = await this.optimizer.calculateSizeReduction(images[0], optimized[0]);
            if (reduction > 0) {
                console.log(`Image optimized: ${reduction}% size reduction`);
            }
        }
        return optimized;
    }
    createProgressEvent(progress, message) {
        return {
            type: 'progress',
            data: { progress, message }
        };
    }
    createPartialEvent(partialImage, index) {
        return {
            type: 'partial',
            data: {
                partialImage,
                partialImageIndex: index,
                progress: 50 + (index * 15),
                message: `Partial image ${index + 1} ready`
            }
        };
    }
    createCompleteEvent(result) {
        return {
            type: 'complete',
            data: {
                finalImage: result.images[0],
                revisedPrompt: result.revised_prompt,
                progress: 100,
                message: 'Image generation completed!'
            }
        };
    }
    createErrorEvent(error) {
        return {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
//# sourceMappingURL=streaming-image-generator.js.map