#!/usr/bin/env tsx

/**
 * Example demonstrating image optimization features
 * Run with: npx tsx examples/optimization-demo.ts
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function runOptimizationDemo() {
  console.log('🖼️  Image Optimization Demo\n');

  // Create MCP client
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
    env: {
      ...process.env,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    },
  });

  const client = new Client({
    name: 'optimization-demo',
    version: '1.0.0',
  }, {
    capabilities: {},
  });

  await client.connect(transport);
  console.log('✅ Connected to MCP server\n');

  try {
    // Example 1: Generate with JPEG optimization
    console.log('1️⃣  Generating landscape with JPEG optimization...');
    const jpegResult = await client.callTool({
      name: 'generate_image',
      arguments: {
        prompt: 'A serene mountain landscape at sunset with vibrant colors',
        format: 'jpeg',
        quality: 'medium',
        output_compression: 75,
      },
    });
    console.log('✅ JPEG optimized image generated\n');

    // Example 2: Generate with WebP optimization
    console.log('2️⃣  Generating art with WebP optimization...');
    const webpResult = await client.callTool({
      name: 'generate_image',
      arguments: {
        prompt: 'Abstract digital art with geometric shapes',
        format: 'webp',
        quality: 'high',
        output_compression: 90,
      },
    });
    console.log('✅ WebP optimized image generated\n');

    // Example 3: Generate with transparent PNG
    console.log('3️⃣  Generating logo with transparent background...');
    const pngResult = await client.callTool({
      name: 'generate_image',
      arguments: {
        prompt: 'A modern tech company logo, minimalist design, transparent background',
        format: 'png',
        background: 'transparent',
        quality: 'high',
      },
    });
    console.log('✅ PNG with transparency generated\n');

    // Example 4: Low quality for drafts
    console.log('4️⃣  Generating draft with low quality...');
    const draftResult = await client.callTool({
      name: 'generate_image',
      arguments: {
        prompt: 'Quick sketch of a user interface mockup',
        format: 'jpeg',
        quality: 'low',
        output_compression: 50,
      },
    });
    console.log('✅ Low quality draft generated\n');

    // Check cache stats
    console.log('5️⃣  Checking cache statistics...');
    const cacheStats = await client.callTool({
      name: 'cache_stats',
      arguments: {},
    });
    console.log(cacheStats.content?.[0]?.text);
    console.log();

    // Example 6: Regenerate to test cache
    console.log('6️⃣  Regenerating first image (should use cache)...');
    const cachedResult = await client.callTool({
      name: 'generate_image',
      arguments: {
        prompt: 'A serene mountain landscape at sunset with vibrant colors',
        format: 'jpeg',
        quality: 'medium',
        output_compression: 75,
      },
    });
    console.log('✅ Image retrieved from cache\n');

    console.log('🎉 Optimization demo completed!');
    console.log('\nOptimization Tips:');
    console.log('- Use JPEG for photos (30-70% size reduction)');
    console.log('- Use WebP for best compression (20-50% size reduction)');
    console.log('- Use PNG only when transparency is needed');
    console.log('- Start with low quality for drafts, then regenerate');
    console.log('- Cached results are returned instantly');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run the demo
runOptimizationDemo().catch(console.error);