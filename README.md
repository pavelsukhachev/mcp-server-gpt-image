# MCP Server GPT Image

[![npm version](https://img.shields.io/npm/v/mcp-server-gpt-image.svg)](https://www.npmjs.com/package/mcp-server-gpt-image)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Version](https://img.shields.io/badge/MCP-1.0.6-blue)](https://modelcontextprotocol.io)

A Model Context Protocol (MCP) server that provides access to OpenAI's GPT Image-1 model for advanced image generation and editing capabilities. This server enables AI assistants like Claude to generate and manipulate images using natural language prompts.

## 🌟 Features

- **🎨 Image Generation**: Create stunning images from text descriptions using GPT Image-1
- **✏️ Image Editing**: Modify existing images with text prompts and optional masks
- **🔄 Multiple Transports**: Supports both stdio (for Claude Desktop) and HTTP (for remote access)
- **🚀 Production Ready**: Docker support, session management, and comprehensive error handling
- **🔒 Secure**: API key authentication via environment variables
- **📊 Flexible Options**: Support for various sizes, quality levels, and output formats

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- OpenAI API key with access to GPT Image-1 model
- [API Organization Verification](https://help.openai.com/en/articles/10910291-api-organization-verification) completed for GPT Image-1 access

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/brisklad/mcp-server-gpt-image.git
cd mcp-server-gpt-image

# Install dependencies
npm install

# Build the project
npm run build
```

### Configuration

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your-openai-api-key-here
PORT=3000
CORS_ORIGIN=*
```

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

## 🛠️ Available Tools

### 1. `generate_image`

Generate images from text prompts.

**Parameters:**
- `prompt` (required): Text description of the image to generate
- `size`: Image dimensions
  - `1024x1024` (default)
  - `1024x1536` (portrait)
  - `1536x1024` (landscape)
  - `auto`
- `quality`: Rendering quality
  - `low`
  - `medium`
  - `high`
  - `auto` (default)
- `format`: Output format (`png`, `jpeg`, `webp`)
- `background`: Background transparency (`transparent`, `opaque`, `auto`)
- `n`: Number of images to generate (1-4)

**Example:**
```javascript
{
  "prompt": "A serene Japanese garden with cherry blossoms at sunset",
  "size": "1536x1024",
  "quality": "high",
  "format": "png"
}
```

### 2. `edit_image`

Edit existing images using text prompts.

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

```
src/
├── index.ts              # Entry point with transport selection
├── server.ts             # MCP server setup and tool registration
├── types.ts              # TypeScript interfaces and Zod schemas
├── tools/
│   └── image-generation.ts   # OpenAI API integration
└── transport/
    └── http.ts           # HTTP/Streamable transport implementation
```

## 💰 Cost Considerations

GPT Image-1 generates images by producing specialized image tokens. Cost and latency depend on:

| Quality | Square (1024×1024) | Portrait (1024×1536) | Landscape (1536×1024) |
|---------|-------------------|---------------------|----------------------|
| Low     | 272 tokens        | 408 tokens          | 400 tokens           |
| Medium  | 1056 tokens       | 1584 tokens         | 1568 tokens          |
| High    | 4160 tokens       | 6240 tokens         | 6208 tokens          |

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Powered by [OpenAI's GPT Image-1](https://platform.openai.com/docs/guides/image-generation)
- Inspired by the MCP community

## 📚 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [OpenAI Image Generation Guide](https://platform.openai.com/docs/guides/image-generation)
- [GPT Image-1 Documentation](https://platform.openai.com/docs/models/gpt-image-1)

## ⚠️ Known Limitations

- GPT Image-1 may take up to 2 minutes for complex prompts
- Text rendering in images may not always be precise
- Mask-based editing follows guidance but may not match exact shapes
- Streaming image generation is not yet available via the Responses API

## 🚧 Roadmap

- [ ] Support for streaming image generation when available
- [ ] Multi-turn image editing conversations
- [ ] Batch image processing
- [ ] WebSocket transport support
- [ ] Built-in image optimization
- [ ] Usage analytics and monitoring

---

**Note**: This is an unofficial implementation. GPT Image-1 is a product of OpenAI.