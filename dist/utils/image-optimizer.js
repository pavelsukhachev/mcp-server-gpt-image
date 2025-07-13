import sharp from 'sharp';
export class ImageOptimizer {
    /**
     * Optimize a base64-encoded image
     */
    static async optimizeBase64(base64Image, options = {}) {
        try {
            // Remove data URI prefix if present
            const base64Data = base64Image.startsWith('data:')
                ? base64Image.split(',')[1]
                : base64Image;
            // Convert base64 to buffer
            const inputBuffer = Buffer.from(base64Data, 'base64');
            // Create sharp instance
            let sharpInstance = sharp(inputBuffer);
            // Get image metadata
            const metadata = await sharpInstance.metadata();
            // Resize if needed
            if (options.maxWidth || options.maxHeight) {
                sharpInstance = sharpInstance.resize({
                    width: options.maxWidth,
                    height: options.maxHeight,
                    fit: 'inside',
                    withoutEnlargement: true,
                });
            }
            // Convert format and apply quality settings
            const format = options.format || this.detectOptimalFormat(metadata);
            const quality = options.quality || this.getDefaultQuality(format);
            switch (format) {
                case 'jpeg':
                    sharpInstance = sharpInstance.jpeg({
                        quality,
                        progressive: true,
                        mozjpeg: true,
                    });
                    break;
                case 'webp':
                    sharpInstance = sharpInstance.webp({
                        quality,
                        effort: 6,
                        lossless: quality === 100,
                    });
                    break;
                case 'png':
                default:
                    sharpInstance = sharpInstance.png({
                        compressionLevel: 9,
                        progressive: true,
                        palette: quality < 100,
                        quality,
                    });
                    break;
            }
            // Process the image
            const outputBuffer = await sharpInstance.toBuffer();
            // Convert back to base64
            return outputBuffer.toString('base64');
        }
        catch (error) {
            console.error('Image optimization error:', error);
            // Return original image if optimization fails
            return base64Image;
        }
    }
    /**
     * Optimize images based on generation/edit input parameters
     */
    static async optimizeForOutput(base64Image, input) {
        const options = {
            format: input.format || 'png',
            quality: this.mapQualityToNumber(input.quality, input.output_compression),
            preserveTransparency: input.background === 'transparent',
        };
        // Set max dimensions based on size
        if (input.size && input.size !== 'auto') {
            const [width, height] = input.size.split('x').map(Number);
            options.maxWidth = width;
            options.maxHeight = height;
        }
        return this.optimizeBase64(base64Image, options);
    }
    /**
     * Batch optimize multiple images
     */
    static async optimizeBatch(base64Images, input) {
        return Promise.all(base64Images.map(image => this.optimizeForOutput(image, input)));
    }
    /**
     * Detect optimal format based on image characteristics
     */
    static detectOptimalFormat(metadata) {
        // If image has alpha channel, prefer PNG or WebP
        if (metadata.hasAlpha) {
            return 'png';
        }
        // For photos, prefer JPEG
        if (metadata.density && metadata.density > 72) {
            return 'jpeg';
        }
        // Default to WebP for best compression
        return 'webp';
    }
    /**
     * Map quality setting to numeric value
     */
    static mapQualityToNumber(quality, compression) {
        // If explicit compression is provided, use it
        if (compression !== undefined) {
            return Math.max(0, Math.min(100, compression));
        }
        // Map quality levels
        switch (quality) {
            case 'low':
                return 60;
            case 'medium':
                return 80;
            case 'high':
                return 95;
            case 'auto':
            default:
                return 85;
        }
    }
    /**
     * Get default quality for format
     */
    static getDefaultQuality(format) {
        switch (format) {
            case 'jpeg':
                return 85;
            case 'webp':
                return 85;
            case 'png':
            default:
                return 95;
        }
    }
    /**
     * Calculate size reduction percentage
     */
    static async calculateSizeReduction(originalBase64, optimizedBase64) {
        const originalSize = Buffer.from(originalBase64, 'base64').length;
        const optimizedSize = Buffer.from(optimizedBase64, 'base64').length;
        const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
        return Math.round(reduction * 10) / 10; // Round to 1 decimal place
    }
}
//# sourceMappingURL=image-optimizer.js.map