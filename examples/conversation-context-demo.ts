#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Demonstrates the conversation context feature for iterative image refinement
 */
async function demonstrateConversationContext() {
  console.log('🎨 MCP GPT Image-1 - Conversation Context Demo\n');

  // Initialize MCP client
  const client = new Client({
    name: 'conversation-context-demo',
    version: '1.0.0',
  }, {
    capabilities: {}
  });

  const serverPath = path.join(process.cwd(), 'dist/index.js');
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath, 'stdio'],
    env: {
      ...process.env,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  });

  await client.connect(transport);

  const conversationId = `landscape-design-${Date.now()}`;
  console.log(`📝 Starting conversation: ${conversationId}\n`);

  try {
    // Step 1: Initial generation without context
    console.log('🖼️  Step 1: Creating initial landscape...');
    const result1 = await client.callTool({
      name: 'generate_image',
      arguments: {
        prompt: 'Create a serene mountain landscape with snow-capped peaks during golden hour',
        conversationId: conversationId,
        useContext: false, // First generation doesn't need context
        size: '1536x1024',
        quality: 'high'
      }
    });

    if (result1.content?.[0]?.type === 'text') {
      console.log(result1.content[0].text);
    }
    
    // Save first image
    if (result1.content?.[1]?.type === 'image') {
      await fs.writeFile(
        `output/conversation-${conversationId}-step1.png`,
        Buffer.from(result1.content[1].data, 'base64')
      );
      console.log('✅ Saved: step1.png\n');
    }

    // Step 2: Add elements with context
    console.log('🏞️  Step 2: Adding a crystal clear lake...');
    const result2 = await client.callTool({
      name: 'generate_image',
      arguments: {
        prompt: 'Add a crystal clear alpine lake in the foreground reflecting the mountains',
        conversationId: conversationId,
        useContext: true, // Use context from previous generation
        size: '1536x1024',
        quality: 'high'
      }
    });

    if (result2.content?.[0]?.type === 'text') {
      console.log(result2.content[0].text);
    }

    // Save second image
    if (result2.content?.[1]?.type === 'image') {
      await fs.writeFile(
        `output/conversation-${conversationId}-step2.png`,
        Buffer.from(result2.content[1].data, 'base64')
      );
      console.log('✅ Saved: step2.png\n');
    }

    // Step 3: Edit with context (assuming we have the base64 from step 2)
    console.log('🌅 Step 3: Enhancing the sky with dramatic colors...');
    const imageBase64 = result2.content?.[1]?.data;
    
    if (imageBase64) {
      const result3 = await client.callTool({
        name: 'edit_image',
        arguments: {
          prompt: 'Make the sky more dramatic with vibrant sunset colors, purple and orange hues',
          images: [imageBase64],
          conversationId: conversationId,
          useContext: true, // Context includes both previous prompts
          size: '1536x1024',
          quality: 'high'
        }
      });

      if (result3.content?.[0]?.type === 'text') {
        console.log(result3.content[0].text);
      }

      // Save final image
      if (result3.content?.[1]?.type === 'image') {
        await fs.writeFile(
          `output/conversation-${conversationId}-step3-final.png`,
          Buffer.from(result3.content[1].data, 'base64')
        );
        console.log('✅ Saved: step3-final.png\n');
      }
    }

    // View conversation history
    console.log('📜 Viewing conversation history...\n');
    const history = await client.callTool({
      name: 'get_conversation',
      arguments: {
        conversationId: conversationId
      }
    });

    if (history.content?.[0]?.type === 'text') {
      console.log(history.content[0].text);
    }

    // List all conversations
    console.log('\n📋 All active conversations:');
    const conversations = await client.callTool({
      name: 'list_conversations',
      arguments: {}
    });

    if (conversations.content?.[0]?.type === 'text') {
      console.log(conversations.content[0].text);
    }

    // Optional: Clear the conversation
    // console.log('\n🧹 Clearing conversation...');
    // await client.callTool({
    //   name: 'clear_conversation',
    //   arguments: {
    //     conversationId: conversationId
    //   }
    // });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await transport.close();
  }
}

// Create output directory
await fs.mkdir('output', { recursive: true });

// Run the demo
demonstrateConversationContext().catch(console.error);