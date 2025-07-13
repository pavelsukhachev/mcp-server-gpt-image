# API Documentation

## Overview

The MCP Server GPT Image-1 provides multiple endpoints for image generation and management. The server supports both MCP protocol communication and direct HTTP/SSE streaming.

## Base URL

```
http://localhost:3000
```

## Authentication

All requests require an OpenAI API key, which should be provided via environment variable:

```bash
OPENAI_API_KEY=your-api-key-here
```

## Endpoints

### Health Check

Check if the server is running and healthy.

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "gpt-image-1-mcp-server"
}
```

### MCP Protocol Endpoint

Main endpoint for MCP protocol communication.

```http
POST /mcp
```

**Headers:**
- `Content-Type: application/json`
- `X-Session-ID: <session-id>` (optional, will be generated if not provided)

**Request Body:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "generate_image",
    "arguments": {
      "prompt": "A beautiful landscape",
      "size": "1024x1024",
      "quality": "high"
    }
  },
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Generated 1 image(s) successfully."
      },
      {
        "type": "image",
        "data": "base64_encoded_image_data...",
        "mimeType": "image/png"
      }
    ]
  },
  "id": 1
}
```

### Streaming Image Generation

Generate images with real-time progress updates using Server-Sent Events.

```http
POST /mcp/stream
```

**Headers:**
- `Content-Type: application/json`
- `X-Session-ID: <session-id>` (optional)

**Request Body:**
```json
{
  "prompt": "A futuristic city at sunset",
  "size": "1024x1024",
  "quality": "high",
  "format": "jpeg",
  "partialImages": 3,
  "output_compression": 80
}
```

**Response:** Server-Sent Events stream

**Event Format:**
```
data: {"type":"<event-type>","data":{...}}

```

**Event Types:**

1. **Progress Event**
```json
{
  "type": "progress",
  "data": {
    "progress": 50,
    "message": "Processing prompt..."
  }
}
```

2. **Partial Image Event**
```json
{
  "type": "partial",
  "data": {
    "partialImage": "base64_encoded_partial_image...",
    "partialImageIndex": 0,
    "progress": 40,
    "message": "Partial image 1 received"
  }
}
```

3. **Complete Event**
```json
{
  "type": "complete",
  "data": {
    "finalImage": "base64_encoded_final_image...",
    "revisedPrompt": "A futuristic cityscape with tall buildings...",
    "progress": 100,
    "message": "Image generation completed!"
  }
}
```

4. **Error Event**
```json
{
  "type": "error",
  "error": "Error message here"
}
```

**End of Stream:**
```
data: [DONE]
```

### Session Management

Delete a session and clean up resources.

```http
DELETE /mcp/session/:sessionId
```

**Response:**
```json
{
  "message": "Session closed"
}
```

## MCP Tools

### generate_image

Generate images from text prompts.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| prompt | string | Yes | - | Text description of the image |
| size | string | No | "1024x1024" | Image dimensions: "1024x1024", "1024x1536", "1536x1024", "auto" |
| quality | string | No | "auto" | Quality level: "low", "medium", "high", "auto" |
| format | string | No | "png" | Output format: "png", "jpeg", "webp" |
| background | string | No | "auto" | Background: "transparent", "opaque", "auto" |
| output_compression | number | No | - | Compression level (0-100) |
| moderation | string | No | "auto" | Content moderation: "auto", "low" |
| n | number | No | 1 | Number of images (1-4) |
| partialImages | number | No | - | Number of partial images (1-3) |
| stream | boolean | No | false | Enable streaming mode |

**Example:**
```json
{
  "name": "generate_image",
  "arguments": {
    "prompt": "A serene mountain lake at sunrise",
    "size": "1536x1024",
    "quality": "high",
    "format": "jpeg",
    "output_compression": 85,
    "partialImages": 2
  }
}
```

### edit_image

Edit existing images with text prompts and optional masks.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| prompt | string | Yes | - | Text description of the edit |
| images | string[] | Yes | - | Array of base64-encoded images |
| mask | string | No | - | Base64-encoded mask for inpainting |
| size | string | No | "1024x1024" | Output dimensions |
| quality | string | No | "auto" | Quality level |
| format | string | No | "png" | Output format |
| n | number | No | 1 | Number of variations |

**Example:**
```json
{
  "name": "edit_image",
  "arguments": {
    "prompt": "Add a rainbow in the sky",
    "images": ["base64_encoded_image..."],
    "mask": "base64_encoded_mask..."
  }
}
```

### clear_cache

Clear all cached images from memory and disk.

**Parameters:** None

**Example:**
```json
{
  "name": "clear_cache",
  "arguments": {}
}
```

### cache_stats

Get cache statistics.

**Parameters:** None

**Response Example:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Cache Statistics:\n- Memory entries: 5\n- Estimated disk usage: 2.5 MB"
    }
  ]
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `invalid_params` | Invalid or missing parameters |
| `method_not_found` | Unknown tool or method |
| `internal_error` | Server internal error |
| `api_error` | OpenAI API error |
| `streaming_error` | Streaming-specific error |

### HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Session or resource not found |
| 500 | Internal Server Error |

## Rate Limiting

The server respects OpenAI's rate limits:
- Requests are queued if rate limits are reached
- Cached responses bypass API calls entirely
- Monitor `X-RateLimit-*` headers in responses

## Best Practices

### 1. Session Management
- Reuse session IDs for related requests
- Clean up sessions when done
- Sessions auto-expire after inactivity

### 2. Caching
- Identical requests return cached results
- Use cache_stats to monitor usage
- Clear cache periodically if needed

### 3. Streaming
- Use streaming for better UX with progress updates
- Handle partial images for preview
- Implement proper error handling for SSE

### 4. Error Handling
- Always check for error events in streams
- Implement exponential backoff for retries
- Log errors for debugging

### 5. Performance
- Use appropriate quality settings
- Enable caching for repeated requests
- Use streaming for large images

## Examples

### cURL Examples

**Basic Generation:**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test-session" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "generate_image",
      "arguments": {
        "prompt": "A cute cat"
      }
    },
    "id": 1
  }'
```

**Streaming Generation:**
```bash
curl -X POST http://localhost:3000/mcp/stream \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test-stream" \
  -d '{
    "prompt": "A majestic dragon",
    "partialImages": 3,
    "quality": "high"
  }' \
  -N
```

### JavaScript/TypeScript Examples

See the `examples/` directory for complete implementations:
- `streaming-client.ts` - SSE streaming example
- `test-client.ts` - Basic MCP client
- `optimization-demo.ts` - Image optimization demo