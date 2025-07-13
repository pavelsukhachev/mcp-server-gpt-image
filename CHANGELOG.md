# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Streaming Support** - Real-time image generation with Server-Sent Events (SSE)
  - New `/mcp/stream` endpoint for streaming requests
  - Progress events with percentage and status messages
  - Partial image previews (1-3 configurable)
  - Complete event with final optimized image
  - Error handling with proper SSE format

- **Response Caching** - Two-tier caching system for improved performance
  - Memory cache for instant repeated requests
  - Disk cache for persistent storage across restarts
  - Content-based cache keys using SHA256 hashing
  - Configurable TTL and size limits
  - New tools: `clear_cache` and `cache_stats`
  - Automatic cleanup when limits exceeded

- **Image Optimization** - Automatic compression and format conversion
  - Sharp library integration for image processing
  - Support for JPEG, PNG, and WebP formats
  - Configurable quality/compression levels
  - Progressive encoding for better perceived performance
  - Typical size reductions of 30-80%
  - Preserves transparency when needed

- **New Configuration Options**
  - `CACHE_DIR` - Directory for disk cache storage
  - `CACHE_TTL` - Time-to-live for cache entries
  - `CACHE_MAX_SIZE` - Maximum cache size in MB
  - `output_compression` parameter for explicit quality control
  - `partialImages` parameter for streaming previews
  - `format` parameter for output format selection

- **Enhanced Documentation**
  - Comprehensive API.md with all endpoints and parameters
  - Updated README.md with streaming, caching, and optimization sections
  - Detailed examples for all new features
  - Performance tips and best practices
  - Cost considerations with token usage table

### Changed
- Improved error handling with more descriptive messages
- Enhanced logging for cache hits/misses and optimization metrics
- Updated TypeScript types for new parameters
- Refactored image generation to support streaming workflow

### Fixed
- Removed unsupported `response_format` parameter from OpenAI API calls
- Improved base64 encoding/decoding for large images
- Better error handling for rate limits and API failures

## [1.0.0] - 2024-01-01

### Initial Release
- Basic image generation with GPT Image-1
- Image editing with prompts and masks
- MCP protocol support
- HTTP transport with CORS
- Docker support
- Session management
- Basic error handling