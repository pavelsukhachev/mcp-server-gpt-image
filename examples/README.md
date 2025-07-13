# MCP Server GPT Image - Examples

This directory contains examples for using the MCP Server GPT Image with various clients, including streaming, caching, and optimization features.

## Claude Desktop Configuration

### Basic Configuration

The simplest configuration for Claude Desktop:

```json
{
  "mcpServers": {
    "gpt-image": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server-gpt-image/dist/index.js", "stdio"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here"
      }
    }
  }
}
```

### Advanced Configuration with Custom Settings

```json
{
  "mcpServers": {
    "gpt-image": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server-gpt-image/dist/index.js", "stdio"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here",
        "NODE_ENV": "production",
        "LOG_LEVEL": "info",
        "CACHE_DIR": ".cache/images",
        "CACHE_TTL": "3600",
        "CACHE_MAX_SIZE": "100"
      }
    }
  }
}
```

## Example Prompts for Claude

Once configured, you can use these example prompts with Claude:

### Image Generation

```
Can you generate an image of a futuristic city skyline at sunset with flying cars?
```

```
Please create a high-quality landscape image of a serene mountain lake with autumn colors.
```

```
Generate a transparent PNG of a cartoon robot character for my website.
```

### Image Editing

```
I have this landscape photo [attach image]. Can you add a rainbow in the sky?
```

```
Please edit this portrait [attach image] to add a professional background.
```

## Using the HTTP API

### Starting the Server

```bash
# Using npm
npm run start:http

# Using Docker
docker-compose up
```

### Example API Calls

#### Initialize Session

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-Session-ID: my-session-123" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-15",
      "capabilities": {"tools": {}},
      "clientInfo": {"name": "example-client", "version": "1.0.0"}
    },
    "id": 1
  }'
```

#### List Available Tools

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-Session-ID: my-session-123" \
  -H "MCP-Session-Id: my-session-123" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 2
  }'
```

#### Generate an Image

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "X-Session-ID: my-session-123" \
  -H "MCP-Session-Id: my-session-123" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "generate_image",
      "arguments": {
        "prompt": "A beautiful sunset over mountains",
        "size": "1536x1024",
        "quality": "high",
        "format": "png"
      }
    },
    "id": 3
  }'
```

#### Generate an Image with Streaming

```bash
curl -X POST http://localhost:3000/mcp/stream \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: my-session-123" \
  -N \
  -d '{
    "prompt": "A futuristic city with flying cars",
    "size": "1024x1024",
    "quality": "high",
    "partialImages": 3,
    "format": "jpeg",
    "output_compression": 85
  }'
```

## Example Files

This directory includes several complete examples:

### 1. `test-client.ts` - Basic MCP Client
A simple example showing how to connect to the MCP server and generate images.

```bash
npx tsx examples/test-client.ts
```

### 2. `streaming-client.ts` - Streaming with SSE
Demonstrates real-time image generation with progress updates and partial previews.

```bash
npx tsx examples/streaming-client.ts
```

Features:
- Real-time progress tracking
- Partial image previews
- Error handling
- Multiple streaming examples

### 3. `optimization-demo.ts` - Image Optimization
Shows different optimization strategies for various use cases.

```bash
npx tsx examples/optimization-demo.ts
```

Features:
- JPEG optimization for photos
- WebP for best compression
- PNG with transparency
- Cache performance testing

## JavaScript/TypeScript Client Example

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

async function generateImage() {
  // Create client
  const client = new Client({
    name: 'example-client',
    version: '1.0.0',
  });

  // Connect to server
  const transport = new StreamableHTTPClientTransport(
    new URL('http://localhost:3000/mcp'),
    {
      headers: {
        'X-Session-ID': `session-${Date.now()}`,
      },
    }
  );

  await client.connect(transport);

  // Generate image
  const result = await client.callTool('generate_image', {
    prompt: 'A majestic mountain landscape at sunset',
    size: '1536x1024',
    quality: 'high',
    format: 'png',
  });

  // Extract image data
  const imageContent = result.content?.find(c => c.type === 'image');
  if (imageContent?.data) {
    // Save to file
    const fs = await import('fs');
    fs.writeFileSync('generated.png', Buffer.from(imageContent.data, 'base64'));
    console.log('Image saved as generated.png');
  }

  await client.close();
}

generateImage().catch(console.error);
```

## Docker Deployment Example

### docker-compose.yml for Production

```yaml
version: '3.8'

services:
  mcp-gpt-image:
    image: yourusername/mcp-server-gpt-image:latest
    container_name: mcp-gpt-image-prod
    restart: unless-stopped
    ports:
      - "8080:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=production
      - CORS_ORIGIN=https://yourdomain.com
    volumes:
      - ./generated-images:/app/generated-images
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Running with Docker

```bash
# Set your API key
export OPENAI_API_KEY=your-api-key-here

# Run the container
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Common Use Cases

### 1. Blog Post Illustrations

Generate custom illustrations for blog posts:

```javascript
{
  "prompt": "A minimalist illustration of cloud computing concepts with servers and data connections",
  "size": "1536x1024",
  "quality": "medium",
  "format": "jpeg"
}
```

### 2. Social Media Graphics

Create eye-catching social media posts:

```javascript
{
  "prompt": "A vibrant Instagram post background with abstract shapes and gradient colors",
  "size": "1024x1024",
  "quality": "high",
  "format": "png"
}
```

### 3. Product Mockups

Generate product visualization:

```javascript
{
  "prompt": "A sleek smartphone mockup displaying a weather app on a clean desk setup",
  "size": "1024x1536",
  "quality": "high",
  "format": "png"
}
```

### 4. Logo Concepts

Create logo ideas with transparency:

```javascript
{
  "prompt": "A modern tech company logo featuring a stylized circuit board pattern",
  "size": "1024x1024",
  "quality": "high",
  "format": "png",
  "background": "transparent"
}
```

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY environment variable is required"**
   - Make sure you've set the API key in your environment or configuration

2. **"Organization not verified for GPT Image-1"**
   - Complete the [API Organization Verification](https://help.openai.com/en/articles/10910291-api-organization-verification)

3. **"Bad Request: Mcp-Session-Id header is required"**
   - Ensure you're including the MCP-Session-Id header after initialization

4. **Image quality issues**
   - Try using `quality: "high"` for better results
   - Be more specific in your prompts
   - Use appropriate image sizes for your use case

## Best Practices

1. **Prompt Engineering**
   - Be specific and descriptive
   - Include style references (e.g., "photorealistic", "cartoon", "oil painting")
   - Mention important details like lighting, perspective, and mood

2. **Resource Management**
   - Use appropriate quality settings for your needs
   - Consider using lower quality for drafts and iterations
   - Cache generated images when possible

3. **Error Handling**
   - Always handle API errors gracefully
   - Implement retry logic for transient failures
   - Log errors for debugging

4. **Security**
   - Never expose API keys in client-side code
   - Use environment variables for sensitive data
   - Implement rate limiting for public endpoints