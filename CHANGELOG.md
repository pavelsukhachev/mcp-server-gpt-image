# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-01-13

### Added
- **OpenAI Responses API Integration** - Full support for the latest 2025 Responses API
  - New `ResponsesImageGenerator` service using gpt-4o model with image_generation tool
  - `ResponsesAPIAdapter` for handling both sync and streaming API calls
  - Comprehensive interface definitions for Responses API compatibility
  - Native multimodal understanding with better context awareness
  - Enhanced prompt following and superior text rendering in images

- **Dual API Architecture** - Seamless switching between API modes
  - `API_MODE` environment variable for runtime API selection
  - Default to Responses API (recommended) with fallback to Images API
  - Backward compatibility with existing Images API implementations
  - Unified interface supporting both legacy and modern workflows

- **Enhanced Image Editing** - Advanced editing capabilities via Responses API
  - Multi-image input support with proper message formatting
  - Context-aware editing with conversation history integration
  - Mask support for precise inpainting operations
  - Previous response ID linking for multi-turn editing sessions

- **Comprehensive Test Coverage** - 99+ tests with full API coverage
  - `ResponsesImageGenerator` test suite (11 tests)
  - `ResponsesAPIAdapter` test suite (9 tests)
  - Complete error handling and edge case coverage
  - Mock-based testing with proper dependency injection
  - Real API key validation and integration testing

- **Updated Configuration System**
  - `RESPONSES_MODEL` for Responses API model selection (default: gpt-4o)
  - Enhanced tool configuration with image generation parameters
  - Flexible model switching between dedicated and integrated approaches

### Changed
- Updated README.md with comprehensive dual API documentation
- Enhanced environment variable documentation
- Added API mode comparison table and feature matrix
- Improved streaming examples for both API modes
- Updated roadmap to reflect completed Responses API integration

### Fixed
- Proper error handling for both API implementations
- Consistent response formatting across API modes
- Fixed test mocking issues with OpenAI SDK
- Improved conversation context handling in edit operations

## [Unreleased]

### Added
- **SOLID Architecture Refactoring** - Complete codebase restructuring following SOLID principles
  - Single Responsibility: Separated concerns into focused services
  - Open/Closed: Extensible through interfaces without modification
  - Liskov Substitution: Consistent interface implementations
  - Interface Segregation: Focused, specific interfaces
  - Dependency Inversion: Services depend on abstractions
  
- **Comprehensive Test Suite** - TDD implementation with 81+ tests
  - Unit tests for all core services and utilities
  - Integration tests for MCP server endpoints
  - Streaming functionality tests
  - 98%+ coverage for utilities, 78%+ for services
  - Vitest framework with fast execution

- **Documentation Updates**
  - New ARCHITECTURE.md documenting SOLID implementation
  - New TESTING.md with testing guidelines
  - Updated CONTRIBUTING.md with TDD practices
  - Enhanced README.md with architecture overview

### Changed
- Refactored image generation into separate service classes
- Introduced dependency injection throughout the codebase
- Improved error handling and type safety

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