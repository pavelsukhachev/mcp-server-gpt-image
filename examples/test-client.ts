/**
 * Example client for testing the MCP Server GPT Image
 * 
 * This demonstrates how to connect to the server and use both
 * image generation and editing capabilities.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import fs from 'fs/promises';
import path from 'path';

async function testImageGeneration() {
  console.log('🚀 MCP Server GPT Image - Test Client\n');
  console.log('This example demonstrates image generation and editing capabilities.\n');

  // Create client
  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  });

  // Connect to server
  const serverUrl = process.env.MCP_SERVER_URL || 'http://localhost:3000/mcp';
  const transport = new StreamableHTTPClientTransport(
    new URL(serverUrl),
    {
      headers: {
        'X-Session-ID': `test-session-${Date.now()}`,
      },
    }
  );

  await client.connect(transport);
  console.log('✅ Connected to MCP server\n');

  // List available tools
  const tools = await client.listTools();
  console.log('📋 Available tools:');
  tools.tools.forEach(tool => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });
  console.log();

  // Test 1: Generate Image
  console.log('🎨 Test 1: Generating image...');
  const generateResult = await client.callTool('generate_image', {
    prompt: 'A futuristic city at sunset with flying cars and neon lights',
    size: '1536x1024',
    quality: 'high',
    format: 'png',
  });

  console.log('✅ Image generated successfully!');
  
  // Save generated image
  if (generateResult.content?.[1]?.type === 'image') {
    const imageData = generateResult.content[1].data;
    const outputDir = path.join(process.cwd(), 'examples', 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    const imagePath = path.join(outputDir, 'generated-city.png');
    await fs.writeFile(imagePath, Buffer.from(imageData, 'base64'));
    console.log(`💾 Saved to: ${imagePath}`);
  }

  // Test 2: Edit Image (if we have a generated image)
  if (generateResult.content?.[1]?.type === 'image') {
    console.log('\n✏️ Test 2: Editing image...');
    
    const editResult = await client.callTool('edit_image', {
      prompt: 'Add a large moon in the sky',
      images: [generateResult.content[1].data],
      size: '1536x1024',
      format: 'png',
    });

    console.log('✅ Image edited successfully!');
    
    if (editResult.content?.[1]?.type === 'image') {
      const editedImageData = editResult.content[1].data;
      const editedImagePath = path.join(process.cwd(), 'examples', 'output', 'edited-city.png');
      await fs.writeFile(editedImagePath, Buffer.from(editedImageData, 'base64'));
      console.log(`💾 Saved to: ${editedImagePath}`);
    }
  }

  // Test 3: Generate with transparency
  console.log('\n🌟 Test 3: Generating image with transparency...');
  const transparentResult = await client.callTool('generate_image', {
    prompt: 'A 2D pixel art character sprite of a robot, isolated on transparent background',
    size: '1024x1024',
    quality: 'high',
    format: 'png',
    background: 'transparent',
  });

  console.log('✅ Transparent image generated successfully!');
  
  if (transparentResult.content?.[1]?.type === 'image') {
    const imageData = transparentResult.content[1].data;
    const imagePath = path.join(process.cwd(), 'examples', 'output', 'robot-sprite.png');
    await fs.writeFile(imagePath, Buffer.from(imageData, 'base64'));
    console.log(`💾 Saved to: ${imagePath}`);
  }

  // Disconnect
  await client.close();
  console.log('\n👋 Disconnected from server');
}

// Run the test
testImageGeneration().catch(console.error);