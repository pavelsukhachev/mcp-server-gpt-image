export class ImageGenerator {
    openaiClient;
    cache;
    optimizer;
    fileConverter;
    conversationContext;
    constructor(openaiClient, cache, optimizer, fileConverter, conversationContext) {
        this.openaiClient = openaiClient;
        this.cache = cache;
        this.optimizer = optimizer;
        this.fileConverter = fileConverter;
        this.conversationContext = conversationContext;
    }
    async generate(input) {
        // Check cache first
        const cached = await this.cache.get('generate', input);
        if (cached) {
            return cached;
        }
        // Enhance prompt with context if enabled
        let enhancedPrompt = input.prompt;
        if (input.useContext && input.conversationId && this.conversationContext) {
            const context = await this.conversationContext.getContext(input.conversationId);
            if (context) {
                enhancedPrompt = await this.conversationContext.generateEnhancedPrompt(input.prompt, context, input.maxContextEntries);
            }
        }
        // Generate images
        const response = await this.openaiClient.generateImage({
            model: 'gpt-image-1',
            prompt: enhancedPrompt,
            size: !input.size || input.size === 'auto' ? '1024x1024' : input.size,
            quality: input.quality || 'auto',
            n: input.n,
        });
        // Extract images from response
        const images = this.extractImagesFromResponse(response);
        // Optimize images if needed
        const optimizedImages = await this.optimizeImages(images, input);
        const result = {
            images: optimizedImages,
            revised_prompt: response.data?.[0]?.revised_prompt,
        };
        // Cache the result
        await this.cache.set('generate', input, result);
        // Add to conversation context if enabled
        if (input.conversationId && this.conversationContext) {
            await this.conversationContext.addEntry(input.conversationId, {
                prompt: input.prompt,
                revisedPrompt: response.data?.[0]?.revised_prompt,
                imageData: optimizedImages[0], // Store first image for context
                imageMetadata: {
                    size: input.size || '1024x1024',
                    quality: input.quality || 'auto',
                    format: input.format || 'png'
                },
                timestamp: new Date()
            });
        }
        return result;
    }
    async edit(input) {
        // Check cache first
        const cached = await this.cache.get('edit', input);
        if (cached) {
            return cached;
        }
        // Enhance prompt with context if enabled
        let enhancedPrompt = input.prompt;
        if (input.useContext && input.conversationId && this.conversationContext) {
            const context = await this.conversationContext.getContext(input.conversationId);
            if (context) {
                enhancedPrompt = await this.conversationContext.generateEnhancedPrompt(input.prompt, context, input.maxContextEntries);
            }
        }
        // Convert input images to File objects
        const imageFiles = this.convertImagesToFiles(input.images);
        const maskFile = input.mask ? this.convertMaskToFile(input.mask) : undefined;
        // Edit image
        const response = await this.openaiClient.editImage({
            model: 'gpt-image-1',
            image: imageFiles[0],
            prompt: enhancedPrompt,
            mask: maskFile,
            size: !input.size || input.size === 'auto' ? '1024x1024' : input.size,
            n: input.n,
        });
        // Extract images from response
        const images = this.extractImagesFromResponse(response);
        // Optimize images if needed
        const optimizedImages = await this.optimizeImages(images, input, 'edit');
        const result = {
            images: optimizedImages,
            revised_prompt: response.data?.[0]?.revised_prompt,
        };
        // Cache the result
        await this.cache.set('edit', input, result);
        // Add to conversation context if enabled
        if (input.conversationId && this.conversationContext) {
            await this.conversationContext.addEntry(input.conversationId, {
                prompt: input.prompt,
                revisedPrompt: response.data?.[0]?.revised_prompt,
                imageData: optimizedImages[0], // Store first image for context
                imageMetadata: {
                    size: input.size || '1024x1024',
                    quality: input.quality || 'auto',
                    format: input.format || 'png'
                },
                editMask: input.mask,
                timestamp: new Date()
            });
        }
        return result;
    }
    extractImagesFromResponse(response) {
        return response.data?.map(item => {
            if (item.b64_json) {
                return item.b64_json;
            }
            else if (item.url) {
                throw new Error('URL response not supported yet. Please use b64_json.');
            }
            throw new Error('Invalid response format');
        }) || [];
    }
    async optimizeImages(images, input, operation = 'generate') {
        if (input.output_compression !== undefined || input.format !== 'png') {
            const optimizedImages = await this.optimizer.optimizeBatch(images, input);
            // Log optimization results
            for (let i = 0; i < images.length; i++) {
                const reduction = await this.optimizer.calculateSizeReduction(images[i], optimizedImages[i]);
                if (reduction > 0) {
                    const prefix = operation === 'edit' ? 'Edited image' : 'Image';
                    console.log(`${prefix} ${i + 1} optimized: ${reduction}% size reduction`);
                }
            }
            return optimizedImages;
        }
        return images;
    }
    convertImagesToFiles(images) {
        return images.map((image, index) => {
            const base64Data = this.fileConverter.extractBase64FromDataUrl(image);
            return this.fileConverter.base64ToFile(base64Data, `image_${index}.png`, 'image/png');
        });
    }
    convertMaskToFile(mask) {
        const base64Data = this.fileConverter.extractBase64FromDataUrl(mask);
        return this.fileConverter.base64ToFile(base64Data, 'mask.png', 'image/png');
    }
}
//# sourceMappingURL=image-generator.js.map