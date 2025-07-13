#!/usr/bin/env tsx

/**
 * Example client demonstrating streaming image generation
 * Run with: npx tsx examples/streaming-client.ts
 */

import { EventSource } from 'eventsource';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

interface StreamingEvent {
  type: 'partial' | 'progress' | 'complete' | 'error';
  data?: {
    partialImage?: string;
    partialImageIndex?: number;
    progress?: number;
    message?: string;
    finalImage?: string;
    revisedPrompt?: string;
  };
  error?: string;
}

async function streamImageGeneration(prompt: string, partialImages: number = 3) {
  console.log('🎨 Starting streaming image generation...');
  console.log(`📝 Prompt: "${prompt}"`);
  console.log(`🖼️  Requesting ${partialImages} partial images\n`);

  const requestBody = {
    prompt,
    partialImages,
    size: '1024x1024',
    quality: 'high',
  };

  try {
    const response = await fetch(`${SERVER_URL}/mcp/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete SSE events
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            console.log('\n✅ Streaming completed!');
            return;
          }
          
          try {
            const event: StreamingEvent = JSON.parse(data);
            handleStreamingEvent(event);
          } catch (e) {
            // Skip parsing errors
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function handleStreamingEvent(event: StreamingEvent) {
  switch (event.type) {
    case 'progress':
      const progressBar = '█'.repeat(Math.floor((event.data?.progress || 0) / 5));
      const emptyBar = '░'.repeat(20 - progressBar.length);
      console.log(`⏳ [${progressBar}${emptyBar}] ${event.data?.progress}% - ${event.data?.message}`);
      break;
      
    case 'partial':
      console.log(`\n🖼️  Partial image ${(event.data?.partialImageIndex || 0) + 1} received!`);
      if (event.data?.partialImage) {
        console.log(`   Preview: data:image/png;base64,${event.data.partialImage.substring(0, 50)}...`);
      }
      break;
      
    case 'complete':
      console.log(`\n🎉 Image generation complete!`);
      if (event.data?.revisedPrompt) {
        console.log(`   Revised prompt: "${event.data.revisedPrompt}"`);
      }
      if (event.data?.finalImage) {
        console.log(`   Final image: data:image/png;base64,${event.data.finalImage.substring(0, 50)}...`);
        // In a real application, you would save or display the image
      }
      break;
      
    case 'error':
      console.error(`\n❌ Error: ${event.error}`);
      break;
  }
}

// Example usage
async function main() {
  console.log('🚀 GPT Image-1 Streaming Client Example\n');
  
  // Example 1: Generate with partial images
  await streamImageGeneration(
    'A serene Japanese garden with cherry blossoms and a traditional wooden bridge',
    3
  );
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Example 2: Generate without partial images
  await streamImageGeneration(
    'A futuristic cityscape at sunset with flying cars',
    0
  );
}

// Run the example
main().catch(console.error);