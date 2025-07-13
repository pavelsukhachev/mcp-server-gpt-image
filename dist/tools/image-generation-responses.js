import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function* generateImageWithStreaming(input) {
    try {
        const stream = await openai.beta.responses.stream({
            model: 'gpt-image-1',
            tool_choice: {
                type: 'image_generation',
                tool: {
                    type: 'image_generation',
                    prompt: input.prompt,
                    size: input.size === 'auto' ? '1024x1024' : input.size,
                    quality: input.quality || 'auto',
                    partial_images: input.partialImages || 3, // Request 3 partial images during generation
                },
            },
            stream: true,
        });
        for await (const event of stream) {
            if (event.type === 'response.image_generation_call.in_progress') {
                yield {
                    type: 'progress',
                    data: {
                        progress: 0,
                        message: 'Image generation started...',
                    },
                };
            }
            else if (event.type === 'response.image_generation_call.generating') {
                yield {
                    type: 'progress',
                    data: {
                        progress: 50,
                        message: 'Image is being generated...',
                    },
                };
            }
            else if (event.type === 'response.image_generation_call.partial_image') {
                yield {
                    type: 'partial',
                    data: {
                        partialImage: event.partial_image_b64,
                        partialImageIndex: event.partial_image_index,
                        progress: Math.min(90, 30 + (event.partial_image_index || 0) * 20),
                        message: `Partial image ${(event.partial_image_index || 0) + 1} received`,
                    },
                };
            }
            else if (event.type === 'response.image_generation_call.completed') {
                const imageOutput = event.response.output.find((item) => item.type === 'image_generation_call');
                if (imageOutput && imageOutput.result) {
                    yield {
                        type: 'complete',
                        data: {
                            finalImage: imageOutput.result,
                            revisedPrompt: imageOutput.revised_prompt,
                            progress: 100,
                            message: 'Image generation completed!',
                        },
                    };
                }
                else {
                    throw new Error('No image found in completed response');
                }
            }
            else if (event.type === 'response.failed') {
                throw new Error(event.error?.message || 'Image generation failed');
            }
        }
    }
    catch (error) {
        yield {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
export async function generateImageResponses(input) {
    try {
        const response = await openai.beta.responses.create({
            model: 'gpt-image-1',
            tool_choice: {
                type: 'image_generation',
                tool: {
                    type: 'image_generation',
                    prompt: input.prompt,
                    size: input.size === 'auto' ? '1024x1024' : input.size,
                    quality: input.quality || 'auto',
                },
            },
        });
        const imageOutput = response.output.find((item) => item.type === 'image_generation_call');
        if (imageOutput && imageOutput.result) {
            return {
                images: [imageOutput.result],
                revised_prompt: imageOutput.revised_prompt,
            };
        }
        else {
            throw new Error('No image found in response');
        }
    }
    catch (error) {
        if (error instanceof OpenAI.APIError) {
            throw new Error(`OpenAI API error: ${error.message}`);
        }
        throw error;
    }
}
export async function* editImageWithStreaming(input) {
    try {
        // Convert base64 images to File objects if needed
        const imageFile = input.images[0];
        if (!imageFile) {
            throw new Error('No image provided for editing');
        }
        // For now, use the regular edit API since Responses API might not support edit yet
        // This is a placeholder for when edit streaming is available
        const response = await openai.images.edit({
            model: 'gpt-image-1',
            image: await createFileFromBase64(imageFile, 'image.png'),
            prompt: input.prompt,
            mask: input.mask ? await createFileFromBase64(input.mask, 'mask.png') : undefined,
            size: input.size === 'auto' ? '1024x1024' : input.size,
            n: input.n,
        });
        // Simulate streaming for consistency
        yield {
            type: 'progress',
            data: {
                progress: 50,
                message: 'Processing image edit...',
            },
        };
        const images = response.data?.map(item => {
            if (item.b64_json) {
                return item.b64_json;
            }
            throw new Error('Invalid response format');
        }) || [];
        yield {
            type: 'complete',
            data: {
                finalImage: images[0],
                revisedPrompt: response.data?.[0]?.revised_prompt,
                progress: 100,
                message: 'Image editing completed!',
            },
        };
    }
    catch (error) {
        yield {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
async function createFileFromBase64(base64Data, filename) {
    const data = base64Data.startsWith('data:')
        ? base64Data.split(',')[1]
        : base64Data;
    const buffer = Buffer.from(data, 'base64');
    return new File([buffer], filename, { type: 'image/png' });
}
//# sourceMappingURL=image-generation-responses.js.map