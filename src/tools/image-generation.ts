import OpenAI from 'openai';
import { ImageGenerationInput, ImageEditInput, ImageGenerationResult } from '../types.js';
import { imageCache } from '../utils/cache.js';
import { ImageOptimizer } from '../utils/image-optimizer.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
  try {
    // Check cache first
    const cached = await imageCache.get('generate', input);
    if (cached) {
      return cached;
    }

    // For now, we'll use the Images API endpoint
    // Note: When Responses API support is available, we'll update this
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: input.prompt,
      size: input.size === 'auto' ? '1024x1024' : input.size,
      quality: input.quality || 'auto',
      n: input.n,
    });

    // GPT Image-1 returns b64_json directly
    const images = response.data?.map(item => {
      if (item.b64_json) {
        return item.b64_json;
      } else if (item.url) {
        // Fallback to URL if needed (shouldn't happen with gpt-image-1)
        throw new Error('URL response not supported yet. Please use b64_json.');
      }
      throw new Error('Invalid response format');
    }) || [];
    
    // Optimize images if requested
    let optimizedImages = images;
    if (input.output_compression !== undefined || input.format !== 'png') {
      optimizedImages = await ImageOptimizer.optimizeBatch(images, input);
      
      // Log optimization results
      for (let i = 0; i < images.length; i++) {
        const reduction = await ImageOptimizer.calculateSizeReduction(images[i]!, optimizedImages[i]!);
        if (reduction > 0) {
          console.log(`Image ${i + 1} optimized: ${reduction}% size reduction`);
        }
      }
    }

    const result = {
      images: optimizedImages,
      revised_prompt: response.data?.[0]?.revised_prompt,
    };

    // Cache the result
    await imageCache.set('generate', input, result);

    return result;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw error;
  }
}

export async function editImage(input: ImageEditInput): Promise<ImageGenerationResult> {
  try {
    // Check cache first
    const cached = await imageCache.get('edit', input);
    if (cached) {
      return cached;
    }

    // Convert base64 images to File objects if needed
    const imageFiles = input.images.map((image, index) => {
      if (image.startsWith('data:')) {
        // Extract base64 data from data URL
        const base64Data = image.split(',')[1];
        const buffer = Buffer.from(base64Data!, 'base64');
        return new File([buffer], `image_${index}.png`, { type: 'image/png' });
      } else {
        // Assume it's already base64
        const buffer = Buffer.from(image, 'base64');
        return new File([buffer], `image_${index}.png`, { type: 'image/png' });
      }
    });

    // Create mask file if provided
    let maskFile: File | undefined;
    if (input.mask) {
      const maskData = input.mask.startsWith('data:') 
        ? input.mask.split(',')[1]! 
        : input.mask;
      const maskBuffer = Buffer.from(maskData, 'base64');
      maskFile = new File([maskBuffer], 'mask.png', { type: 'image/png' });
    }

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFiles[0]!,
      prompt: input.prompt,
      mask: maskFile,
      size: input.size === 'auto' ? '1024x1024' : input.size,
      n: input.n,
    });

    // GPT Image-1 returns b64_json directly
    const images = response.data?.map(item => {
      if (item.b64_json) {
        return item.b64_json;
      } else if (item.url) {
        // Fallback to URL if needed (shouldn't happen with gpt-image-1)
        throw new Error('URL response not supported yet. Please use b64_json.');
      }
      throw new Error('Invalid response format');
    }) || [];
    
    // Optimize images if requested
    let optimizedImages = images;
    if (input.output_compression !== undefined || input.format !== 'png') {
      optimizedImages = await ImageOptimizer.optimizeBatch(images, input);
      
      // Log optimization results
      for (let i = 0; i < images.length; i++) {
        const reduction = await ImageOptimizer.calculateSizeReduction(images[i]!, optimizedImages[i]!);
        if (reduction > 0) {
          console.log(`Edited image ${i + 1} optimized: ${reduction}% size reduction`);
        }
      }
    }

    const result = {
      images: optimizedImages,
      revised_prompt: response.data?.[0]?.revised_prompt,
    };

    // Cache the result
    await imageCache.set('edit', input, result);

    return result;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw error;
  }
}

// Future implementation for Responses API with streaming support
export async function generateImageWithStreaming(_input: ImageGenerationInput): Promise<AsyncIterable<any>> {
  // This will be implemented when Responses API support is available
  // For now, throw an informative error
  throw new Error('Streaming image generation via Responses API is not yet implemented. Please use the standard generate_image tool.');
}