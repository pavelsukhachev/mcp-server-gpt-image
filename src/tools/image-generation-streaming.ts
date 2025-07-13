import OpenAI from 'openai';
import { ImageGenerationInput, ImageEditInput, ImageGenerationResult } from '../types.js';
import { imageCache } from '../utils/cache.js';
import { ImageOptimizer } from '../utils/image-optimizer.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface StreamingImageEvent {
  type: 'partial' | 'progress' | 'complete' | 'error';
  data?: {
    partialImage?: string; // base64
    partialImageIndex?: number;
    progress?: number;
    message?: string;
    finalImage?: string; // base64
    revisedPrompt?: string;
  };
  error?: string;
}

// Simulated streaming implementation
// Note: The actual Responses API with streaming is not yet available in the SDK
// This implementation simulates streaming behavior for demonstration
export async function* generateImageWithStreaming(
  input: ImageGenerationInput
): AsyncGenerator<StreamingImageEvent, void, unknown> {
  try {
    // Check cache first
    const cached = await imageCache.get('generate', input);
    if (cached) {
      yield {
        type: 'progress',
        data: {
          progress: 100,
          message: 'Retrieved from cache',
        },
      };
      
      yield {
        type: 'complete',
        data: {
          finalImage: cached.images[0],
          revisedPrompt: cached.revised_prompt,
          progress: 100,
          message: 'Image retrieved from cache!',
        },
      };
      return;
    }

    // Emit progress events
    yield {
      type: 'progress',
      data: {
        progress: 0,
        message: 'Initializing image generation...',
      },
    };

    // Simulate partial images by making the actual request
    // In a real implementation, this would use the Responses API
    yield {
      type: 'progress',
      data: {
        progress: 30,
        message: 'Processing prompt...',
      },
    };

    // Make the actual API call
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: input.prompt,
      size: input.size === 'auto' ? '1024x1024' : input.size,
      quality: input.quality || 'auto',
      n: input.n,
    });

    // Simulate receiving partial images
    if (input.partialImages) {
      const numPartials = input.partialImages || 3;
      for (let i = 0; i < numPartials; i++) {
        yield {
          type: 'progress',
          data: {
            progress: 40 + (i * 15),
            message: `Generating partial image ${i + 1}/${numPartials}...`,
          },
        };
        
        // In a real implementation, we would have actual partial images
        // For now, we'll use the final image as a placeholder
        if (response.data?.[0]?.b64_json) {
          yield {
            type: 'partial',
            data: {
              partialImage: response.data[0].b64_json,
              partialImageIndex: i,
              progress: 50 + (i * 15),
              message: `Partial image ${i + 1} ready`,
            },
          };
        }
      }
    }

    // Final image
    yield {
      type: 'progress',
      data: {
        progress: 90,
        message: 'Finalizing image...',
      },
    };

    const images = response.data?.map(item => {
      if (item.b64_json) {
        return item.b64_json;
      }
      throw new Error('Invalid response format');
    }) || [];

    if (images.length > 0) {
      // Optimize images if requested
      let optimizedImages = images;
      if (input.output_compression !== undefined || input.format !== 'png') {
        yield {
          type: 'progress',
          data: {
            progress: 95,
            message: 'Optimizing image...',
          },
        };

        optimizedImages = await ImageOptimizer.optimizeBatch(images, input);
        
        const reduction = await ImageOptimizer.calculateSizeReduction(images[0]!, optimizedImages[0]!);
        if (reduction > 0) {
          console.log(`Image optimized: ${reduction}% size reduction`);
        }
      }

      const result = {
        images: optimizedImages,
        revised_prompt: response.data?.[0]?.revised_prompt,
      };

      // Cache the result
      await imageCache.set('generate', input, result);

      yield {
        type: 'complete',
        data: {
          finalImage: optimizedImages[0],
          revisedPrompt: response.data?.[0]?.revised_prompt,
          progress: 100,
          message: 'Image generation completed!',
        },
      };
    } else {
      throw new Error('No images generated');
    }
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Non-streaming version using the standard API
export async function generateImageStandard(input: ImageGenerationInput): Promise<ImageGenerationResult> {
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: input.prompt,
      size: input.size === 'auto' ? '1024x1024' : input.size,
      quality: input.quality || 'auto',
      n: input.n,
    });

    const images = response.data?.map(item => {
      if (item.b64_json) {
        return item.b64_json;
      }
      throw new Error('Invalid response format');
    }) || [];

    return {
      images,
      revised_prompt: response.data?.[0]?.revised_prompt,
    };
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw error;
  }
}

// Simulated streaming for image editing
export async function* editImageWithStreaming(
  input: ImageEditInput
): AsyncGenerator<StreamingImageEvent, void, unknown> {
  try {
    yield {
      type: 'progress',
      data: {
        progress: 0,
        message: 'Preparing image for editing...',
      },
    };

    // Convert base64 images to File objects
    const imageFile = input.images[0];
    if (!imageFile) {
      throw new Error('No image provided for editing');
    }

    const imageData = imageFile.startsWith('data:') 
      ? imageFile.split(',')[1]! 
      : imageFile;
    const imageBuffer = Buffer.from(imageData, 'base64');
    const imageFileObj = new File([imageBuffer], 'image.png', { type: 'image/png' });

    let maskFileObj: File | undefined;
    if (input.mask) {
      const maskData = input.mask.startsWith('data:') 
        ? input.mask.split(',')[1]! 
        : input.mask;
      const maskBuffer = Buffer.from(maskData, 'base64');
      maskFileObj = new File([maskBuffer], 'mask.png', { type: 'image/png' });
    }

    yield {
      type: 'progress',
      data: {
        progress: 30,
        message: 'Processing edit request...',
      },
    };

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFileObj,
      prompt: input.prompt,
      mask: maskFileObj,
      size: input.size === 'auto' ? '1024x1024' : input.size,
      n: input.n,
    });

    yield {
      type: 'progress',
      data: {
        progress: 80,
        message: 'Finalizing edited image...',
      },
    };

    const images = response.data?.map(item => {
      if (item.b64_json) {
        return item.b64_json;
      }
      throw new Error('Invalid response format');
    }) || [];

    if (images.length > 0) {
      yield {
        type: 'complete',
        data: {
          finalImage: images[0],
          revisedPrompt: response.data?.[0]?.revised_prompt,
          progress: 100,
          message: 'Image editing completed!',
        },
      };
    } else {
      throw new Error('No edited images generated');
    }
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}