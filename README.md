# MCP Server GPT Image-1

[![npm version](https://img.shields.io/npm/v/mcp-server-gpt-image.svg)](https://www.npmjs.com/package/mcp-server-gpt-image)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Version](https://img.shields.io/badge/MCP-1.0.6-blue)](https://modelcontextprotocol.io)

A Model Context Protocol (MCP) server that provides access to OpenAI's latest image generation capabilities using both the GPT Image-1 model and the new Responses API. This server enables AI assistants like Claude to generate and manipulate images using natural language prompts with cutting-edge multimodal AI technology.

## 🌟 Features

- **🎨 Latest Image Generation**: Create stunning images using OpenAI's GPT Image-1 (2025's state-of-the-art model)
- **🆕 Dual API Support**: Choose between Images API (gpt-image-1) and Responses API (gpt-4o with image tools)
- **✏️ Advanced Image Editing**: Modify existing images with text prompts and optional masks
- **🔄 Multiple Transports**: Supports both stdio (for Claude Desktop) and HTTP (for remote access)
- **⚡ Real-time Streaming**: Server-Sent Events (SSE) for live progress updates and partial previews
- **💾 Smart Caching**: Two-tier caching system (memory + disk) for instant repeated requests
- **🖼️ Image Optimization**: Automatic compression with up to 80% size reduction
- **🚀 Production Ready**: Docker support, session management, and comprehensive error handling
- **🔒 Secure**: API key authentication via environment variables
- **📊 Flexible Options**: Support for various sizes, quality levels, and output formats
- **🔄 Conversation Context**: Multi-turn image editing with conversation history tracking
- **🎯 Superior Text Rendering**: GPT Image-1's enhanced text-in-image capabilities

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- OpenAI API key with access to image generation models
- [API Organization Verification](https://help.openai.com/en/articles/10910291-api-organization-verification) completed for image generation access

## 🚀 Quick Start

### Installation

#### Option 1: Use Pre-built Version (Recommended)

```bash
# Clone the repository
git clone https://github.com/pavelsukhachev/mcp-server-gpt-image.git
cd mcp-server-gpt-image

# Install dependencies (required for runtime)
npm install --production
```

#### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/pavelsukhachev/mcp-server-gpt-image.git
cd mcp-server-gpt-image

# Install all dependencies
npm install

# Build the project
npm run build
```

### Configuration

Create a `.env` file in the root directory:

```env
# Required
OPENAI_API_KEY=your-openai-api-key-here

# API Configuration
API_MODE=responses                   # 'responses' (default, latest) or 'images' (legacy)
RESPONSES_MODEL=gpt-4o              # Model for Responses API (default: gpt-4o)

# Optional
PORT=3000
CORS_ORIGIN=*

# Cache Configuration
CACHE_DIR=.cache/images
CACHE_TTL=3600
CACHE_MAX_SIZE=100

# Feature Flags
ENABLE_CONVERSATION_CONTEXT=true    # Multi-turn conversation support
ENABLE_STREAMING=true               # Real-time streaming updates
ENABLE_OPTIMIZATION=true            # Image optimization
```

## 🎯 API Modes & Model Selection

### Responses API (Recommended)
**Default Mode**: `API_MODE=responses`

- **Model**: gpt-4o with image_generation tool
- **Technology**: Latest 2025 Responses API with integrated GPT Image-1 capabilities
- **Features**: 
  - Native multimodal understanding
  - Better context awareness
  - Enhanced prompt following
  - Superior text rendering in images
  - Real-time streaming with partial previews
  - Multi-turn conversation support

### Images API (Legacy)
**Legacy Mode**: `API_MODE=images`

- **Model**: gpt-image-1 (dedicated image model)
- **Technology**: Traditional Images API endpoint
- **Features**:
  - Direct access to GPT Image-1 model
  - Simple, focused image generation
  - Backward compatibility

### Model Comparison

| Feature | Responses API (gpt-4o) | Images API (gpt-image-1) |
|---------|------------------------|---------------------------|
| **Latest Technology** | ✅ 2025 Responses API | ⚠️ Legacy API |
| **Text in Images** | ✅ Superior | ✅ Good |
| **Context Awareness** | ✅ Excellent | ⚠️ Limited |
| **Streaming** | ✅ Partial previews | ⚠️ Final only |
| **Multi-turn** | ✅ Full support | ⚠️ Basic |
| **Performance** | ✅ Optimized | ✅ Fast |

## 🔧 Usage

### Claude Desktop Integration

Add the following to your Claude Desktop MCP settings (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "gpt-image": {
      "command": "node",
      "args": ["/path/to/mcp-server-gpt-image/dist/index.js", "stdio"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here"
      }
    }
  }
}
```

### Standalone Server (HTTP Mode)

```bash
# Run in HTTP mode for remote access
npm run start:http

# Or use Docker
docker-compose up
```

The server will be available at:
- Health check: `http://localhost:3000/health`
- MCP endpoint: `http://localhost:3000/mcp`
- Streaming endpoint: `http://localhost:3000/mcp/stream`

## 🛠️ Available Tools

### 1. `generate_image`

Generate images from text prompts with optional streaming support.

**Parameters:**
- `prompt` (required): Text description of the image to generate
- `size`: Image dimensions
  - `1024x1024` (default)
  - `1024x1536` (portrait)
  - `1536x1024` (landscape)
  - `auto`
- `quality`: Rendering quality
  - `low` (60% compression)
  - `medium` (80% compression)
  - `high` (95% quality)
  - `auto` (default, 85% quality)
- `format`: Output format (`png`, `jpeg`, `webp`)
- `background`: Background transparency (`transparent`, `opaque`, `auto`)
- `output_compression`: Explicit compression level (0-100)
- `n`: Number of images to generate (1-4)
- `partialImages`: Number of partial images to stream (1-3, enables streaming)
- `stream`: Enable streaming mode for real-time generation updates
- `conversationId`: ID for conversation context tracking (optional)
- `useContext`: Whether to use conversation context from previous interactions (default: false)
- `maxContextEntries`: Maximum number of context entries to consider (1-10, default: 5)

**Example:**
```javascript
{
  "prompt": "A serene Japanese garden with cherry blossoms at sunset",
  "size": "1536x1024",
  "quality": "high",
  "format": "png",
  "partialImages": 2,
  "stream": true
}
```

### 2. `edit_image`

Edit existing images using text prompts and optional masks.

**Parameters:**
- `prompt` (required): Text description of the desired edit
- `images` (required): Array of base64-encoded images to edit
- `mask`: Base64-encoded mask for inpainting (optional)
- Other parameters same as `generate_image`

**Example:**
```javascript
{
  "prompt": "Add a red bridge over the stream",
  "images": ["base64_encoded_image_data..."],
  "mask": "base64_encoded_mask_data..."
}
```

**API Mode Support:**
- **Responses API**: Editing via conversation with image input (recommended)
- **Images API**: Direct image editing using traditional endpoint

### 3. `clear_cache`

Clear all cached images from memory and disk.

**Example:**
```javascript
// No parameters required
{}
```

### 4. `cache_stats`

Get cache statistics including memory entries and disk usage.

**Example:**
```javascript
// No parameters required
{}
```

### 5. `list_conversations`

List all active conversation IDs.

**Example:**
```javascript
// No parameters required
{}
```

### 6. `get_conversation`

Get the full history of a specific conversation.

**Parameters:**
- `conversationId` (required): The conversation ID to retrieve

**Example:**
```javascript
{
  "conversationId": "design-session-123"
}
```

### 7. `clear_conversation`

Clear the history of a specific conversation.

**Parameters:**
- `conversationId` (required): The conversation ID to clear

**Example:**
```javascript
{
  "conversationId": "design-session-123"
}
```

## 🌊 Streaming Image Generation

### Real-time Generation with SSE

The server supports streaming image generation via Server-Sent Events (SSE) for real-time progress updates and partial image previews.

**Endpoint**: `POST /mcp/stream`

**Request Body**:
```json
{
  "prompt": "A beautiful sunset over mountains",
  "partialImages": 3,
  "size": "1024x1024",
  "quality": "high"
}
```

**Response**: Server-Sent Events stream

**Event Types**:
- `progress`: Generation progress updates with percentage and message
- `partial`: Partial image preview (base64 encoded)
- `complete`: Final image with revised prompt
- `error`: Error information if generation fails

### API Mode Examples

**Responses API Streaming** (Recommended):
```typescript
// Using Responses API with gpt-4o
const response = await fetch('http://localhost:3000/mcp/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'A futuristic city with flying cars',
    partialImages: 2,
    apiMode: 'responses'  // Use latest Responses API
  })
});
```

**Images API Streaming** (Legacy):
```typescript
// Using traditional Images API with gpt-image-1
const response = await fetch('http://localhost:3000/mcp/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'A futuristic city with flying cars',
    partialImages: 2,
    apiMode: 'images'  // Use legacy Images API
  })
});
```

**Example Client**:
```typescript
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const events = chunk.split('\n\n');
  
  for (const event of events) {
    if (event.startsWith('data: ')) {
      const data = JSON.parse(event.slice(6));
      console.log('Event:', data.type, data.data?.message);
    }
  }
}
```

See `examples/streaming-client.ts` for a complete implementation.

## 🔄 Multi-turn Conversation Context

### Iterative Image Refinement

The server now supports maintaining conversation context across multiple image generation and editing operations. This allows for iterative refinement where each new prompt can build upon previous results.

**How it works**:
1. Assign a `conversationId` to group related operations
2. Enable `useContext: true` to enhance prompts with previous context
3. The system automatically tracks prompts, revised prompts, and image metadata
4. Context is persisted to disk for resuming sessions later

**Example Workflow**:
```javascript
// Initial generation
{
  "prompt": "Create a serene mountain landscape",
  "conversationId": "landscape-design-001",
  "useContext": false  // First prompt doesn't need context
}

// Iterative refinement with context
{
  "prompt": "Add a crystal clear lake in the foreground",
  "conversationId": "landscape-design-001",
  "useContext": true,  // Will consider previous "mountain landscape" context
  "maxContextEntries": 5
}

// Further editing
{
  "prompt": "Make the sky more dramatic with sunset colors",
  "images": ["previous_generated_image_base64..."],
  "conversationId": "landscape-design-001",
  "useContext": true  // Considers both previous prompts for consistency
}
```

**Benefits**:
- **Consistency**: Maintains style and elements across iterations
- **Context Awareness**: Each generation considers previous prompts and results
- **Session Persistence**: Resume work later with full context preserved
- **Flexible History**: Control how much context to use with `maxContextEntries`

**Managing Conversations**:
- Use `list_conversations` to see all active sessions
- Use `get_conversation` to review the full history of a session
- Use `clear_conversation` to start fresh when needed

## 💾 Response Caching

### Intelligent Cache System

The server includes an intelligent caching system to reduce API calls and improve response times.

**Features**:
- **Memory + Disk Cache**: Two-tier caching for optimal performance
- **Content-Based Keys**: Cache keys based on prompt, size, quality, and other parameters
- **TTL Support**: Configurable time-to-live for cache entries
- **Size Management**: Automatic cleanup when cache exceeds size limits
- **Cache Tools**: Built-in tools for cache management

**Configuration** (via environment variables):
```env
CACHE_DIR=.cache/images      # Cache directory (default: .cache/images)
CACHE_TTL=3600              # Cache TTL in seconds (default: 1 hour)
CACHE_MAX_SIZE=100          # Max cache size in MB (default: 100MB)
```

**Cache Behavior**:
- Identical requests return cached results instantly
- Cache hits are logged for monitoring
- Expired entries are automatically cleaned up
- Edit operations cache based on image+mask+prompt combination

## 🖼️ Image Optimization

### Automatic Optimization Engine

The server includes an intelligent image optimization engine powered by Sharp.

**Features**:
- **Format Conversion**: Automatically convert between PNG, JPEG, and WebP
- **Smart Compression**: Adaptive quality based on image characteristics
- **Size Constraints**: Maintain dimensions while reducing file size
- **Transparency Handling**: Preserve alpha channels when needed
- **Progressive Encoding**: Better perceived loading performance

**Optimization Results**:
- Typical size reductions: 30-70% for JPEG, 20-50% for WebP
- Automatic format selection based on content type
- Preserved visual quality with smaller file sizes
- Logged optimization metrics for monitoring

## 🐳 Docker Support

### Using Docker Compose

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Docker Configuration

The included `docker-compose.yml` provides:
- Automatic container restart
- Health checks
- Volume mounting for generated images
- Environment variable configuration

## 🏗️ Architecture

The codebase follows **SOLID principles** and **clean architecture** patterns for maintainability and testability.

```
src/
├── index.ts                  # Entry point with transport selection
├── server.ts                 # MCP server setup and tool registration
├── types.ts                  # TypeScript interfaces and Zod schemas
├── interfaces/               # Contract definitions (Dependency Inversion)
│   └── image-generation.interface.ts  # Core interfaces for DI
├── services/                 # Business logic (Single Responsibility)
│   ├── image-generator.ts    # Main image generation service
│   ├── streaming-image-generator.ts  # Streaming implementation
│   ├── file-converter.ts     # File conversion utilities
│   └── openai-client-adapter.ts     # OpenAI API adapter
├── adapters/                 # Interface adapters (Open/Closed)
│   ├── cache-adapter.ts      # Cache interface implementation
│   └── optimizer-adapter.ts  # Image optimizer interface
├── tools/
│   ├── image-generation.ts   # Tool endpoints using services
│   └── image-generation-streaming.ts # Streaming endpoints
├── transport/
│   └── http.ts               # HTTP/SSE transport with session management
└── utils/
    ├── cache.ts              # Two-tier caching system
    └── image-optimizer.ts    # Sharp-based image optimization
```

### Key Design Patterns

- **Dependency Injection**: All services depend on interfaces, not concrete implementations
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed Principle**: Services are extensible through interfaces
- **Interface Segregation**: Focused interfaces for specific concerns
- **Liskov Substitution**: All implementations are interchangeable

## 📝 Examples

The `examples/` directory contains complete, runnable examples:

- **`test-client.ts`**: Basic MCP client example
- **`streaming-client.ts`**: Streaming image generation with SSE
- **`optimization-demo.ts`**: Image optimization features demonstration

Run examples with:
```bash
npx tsx examples/streaming-client.ts
```

## 💰 Cost Considerations

GPT Image-1 generates images by producing specialized image tokens. Cost and latency depend on:

| Quality | Square (1024×1024) | Portrait (1024×1536) | Landscape (1536×1024) |
|---------|-------------------|---------------------|----------------------|
| Low     | 272 tokens        | 408 tokens          | 400 tokens           |
| Medium  | 1056 tokens       | 1584 tokens         | 1568 tokens          |
| High    | 4160 tokens       | 6240 tokens         | 6208 tokens          |

**Pricing**: $5.00/1M text input tokens, $10.00/1M image input tokens, $40.00/1M image output tokens

## 🔒 Security Best Practices

1. **API Key Management**:
   - Never commit API keys to version control
   - Use environment variables for sensitive data
   - Rotate API keys regularly

2. **Network Security**:
   - Configure CORS appropriately for production
   - Use HTTPS in production environments
   - Implement rate limiting for public deployments

3. **Input Validation**:
   - All inputs are validated using Zod schemas
   - File size limits are enforced
   - Content moderation is applied by default

## 🚀 Performance Tips

### Optimize Generation Speed
- **Use Lower Quality**: Start with `quality: "low"` for drafts, then regenerate with higher quality
- **Enable Caching**: Identical requests are served instantly from cache
- **Use Streaming**: Get partial results faster with `partialImages` parameter

### Reduce Costs
- **Cache Results**: Automatic caching prevents redundant API calls
- **Optimize Images**: Use compression to reduce storage and bandwidth
- **Monitor Usage**: Track cache stats to understand usage patterns

### Improve Quality
- **Detailed Prompts**: Include style, mood, lighting, and perspective details
- **Reference Styles**: Mention specific art styles or artists for consistency
- **Iterative Refinement**: Use edit_image tool to refine specific areas

## 🚧 Roadmap

### Completed ✅
- [x] Basic image generation and editing
- [x] Docker support
- [x] Pre-built distribution
- [x] Streaming Infrastructure (SSE-based)
- [x] Partial Image Simulation (1-3 previews)
- [x] Response Caching (memory + disk)
- [x] Image Optimization (format conversion & compression)
- [x] SOLID principles architecture refactoring
- [x] Comprehensive test suite with 90+ tests
- [x] Test coverage reporting (98%+ for core utilities)
- [x] TDD (Test-Driven Development) practices
- [x] Multi-turn editing with conversation context
- [x] OpenAI Responses API integration with GPT-4o + image_generation tool
- [x] Dual API support (Images API + Responses API) with seamless switching

### In Progress 🚀
- [ ] Batch processing with queue management

### Future Plans 📅
- [ ] WebSocket transport for bidirectional communication
- [ ] File upload support (direct image handling)
- [ ] Custom prompts library
- [ ] Usage analytics and cost tracking
- [ ] Web dashboard for server management
- [ ] Plugin system for custom processors

## ⚠️ Known Limitations

### API Limitations
- **Generation Time**: Complex prompts may take up to 30 seconds
- **Text Rendering**: Generated text in images may have inconsistencies
- **Response Format**: Currently returns base64 images only (no URL support)
- **Model Access**: Requires organization verification for GPT Image-1

### Technical Limitations
- **Max Image Size**: Limited by base64 encoding and transport constraints
- **Concurrent Requests**: Rate limited by OpenAI API quotas
- **Cache Size**: Limited by available disk space

## 🧪 Testing

The project uses **Vitest** for testing with comprehensive coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/utils/cache.test.ts
```

### Test Coverage
- **Overall**: ~50% statements
- **Core Services**: 78.91% coverage
- **Utilities**: 98.88% coverage (Cache: 100%, ImageOptimizer: 97.69%)
- **Server**: 96.08% coverage

### Testing Approach
- **Unit Tests**: Comprehensive tests for all services and utilities
- **Integration Tests**: MCP server endpoint testing
- **TDD Practice**: Write tests first, then implementation
- **Mocking**: Proper dependency mocking for isolated testing

## 🤝 Contributing

Contributions are welcome! Please follow our development practices:

### Development Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. **Write tests first** (TDD approach)
4. Implement your feature following SOLID principles
5. Ensure all tests pass (`npm test`)
6. Check test coverage (`npm run test:coverage`)
7. Commit your changes (`git commit -m 'Add some amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use dependency injection for new services
- Follow existing code patterns and conventions
- Document complex logic with clear comments

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Powered by [OpenAI's GPT Image-1](https://platform.openai.com/docs/guides/image-generation)
- Image optimization by [Sharp](https://sharp.pixelplumbing.com/)
- Inspired by the MCP community

## 📚 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [OpenAI Image Generation Guide](https://platform.openai.com/docs/guides/image-generation)
- [GPT Image-1 Documentation](https://platform.openai.com/docs/models/gpt-image-1)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)

---

**Note**: This is an unofficial implementation. GPT Image-1 is a product of OpenAI.