# Architecture Documentation

This document describes the architecture of the MCP Server GPT Image-1 project, focusing on the SOLID principles implementation and clean architecture patterns used throughout the codebase.

## Overview

The project follows clean architecture principles with a focus on:
- **Separation of Concerns**: Each component has a single, well-defined responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Testability**: All business logic is easily testable through dependency injection
- **Extensibility**: New features can be added without modifying existing code

## SOLID Principles Implementation

### 1. Single Responsibility Principle (SRP)

Each class has one reason to change:

```typescript
// ❌ Before: Multiple responsibilities
class ImageGeneration {
  generateImage() { /* API calls + caching + optimization */ }
  optimizeImage() { /* optimization logic */ }
  cacheResult() { /* caching logic */ }
}

// ✅ After: Single responsibilities
class ImageGenerator {
  generate() { /* only generation logic */ }
}

class ImageOptimizer {
  optimize() { /* only optimization logic */ }
}

class ImageCache {
  get() { /* only caching logic */ }
  set() { /* only caching logic */ }
}
```

### 2. Open/Closed Principle (OCP)

Classes are open for extension but closed for modification:

```typescript
// Interfaces allow extension without modification
interface IImageGenerator {
  generate(input: ImageGenerationInput): Promise<ImageGenerationResult>;
}

// New implementations can be added without changing existing code
class StandardImageGenerator implements IImageGenerator { }
class StreamingImageGenerator implements IImageGenerator { }
```

### 3. Liskov Substitution Principle (LSP)

Derived classes can be substituted for their base classes:

```typescript
// All implementations follow the same contract
const generators: IImageGenerator[] = [
  new StandardImageGenerator(),
  new StreamingImageGenerator()
];

// Any generator can be used interchangeably
generators.forEach(gen => gen.generate(input));
```

### 4. Interface Segregation Principle (ISP)

Clients shouldn't depend on interfaces they don't use:

```typescript
// Segregated interfaces for different concerns
interface IImageCache {
  get(type: string, input: any): Promise<any>;
  set(type: string, input: any, data: any): Promise<void>;
}

interface IImageOptimizer {
  optimizeBatch(images: string[], input: any): Promise<string[]>;
  calculateSizeReduction(original: string, optimized: string): Promise<number>;
}
```

### 5. Dependency Inversion Principle (DIP)

Depend on abstractions, not concretions:

```typescript
// High-level service depends on abstractions
class ImageGenerator {
  constructor(
    private openaiClient: IOpenAIClient,  // interface
    private cache: IImageCache,           // interface
    private optimizer: IImageOptimizer    // interface
  ) {}
}
```

## Project Structure

```
src/
├── interfaces/           # Abstract contracts (DIP)
│   └── image-generation.interface.ts
│
├── services/            # Core business logic (SRP)
│   ├── image-generator.ts
│   ├── streaming-image-generator.ts
│   ├── file-converter.ts
│   └── openai-client-adapter.ts
│
├── adapters/           # Interface implementations (OCP)
│   ├── cache-adapter.ts
│   └── optimizer-adapter.ts
│
├── tools/             # MCP tool endpoints
│   ├── image-generation.ts
│   └── image-generation-streaming.ts
│
├── utils/             # Utility classes
│   ├── cache.ts
│   └── image-optimizer.ts
│
└── transport/         # Communication layer
    └── http.ts
```

## Key Components

### 1. Interfaces Layer (`src/interfaces/`)

Defines contracts for all major components:
- `IImageGenerator`: Image generation contract
- `IImageCache`: Caching operations contract
- `IImageOptimizer`: Image optimization contract
- `IOpenAIClient`: OpenAI API contract
- `IFileConverter`: File conversion contract

### 2. Services Layer (`src/services/`)

Contains core business logic implementations:

#### ImageGenerator
- Handles standard image generation
- Orchestrates caching, API calls, and optimization
- Depends only on interfaces

#### StreamingImageGenerator
- Implements streaming image generation
- Emits progress events during generation
- Supports partial image previews

#### FileConverter
- Converts between base64 and File objects
- Extracts base64 from data URLs
- Pure utility service with no external dependencies

#### OpenAIClientAdapter
- Adapts OpenAI SDK to our interface
- Handles API error translation
- Isolates third-party dependencies

### 3. Adapters Layer (`src/adapters/`)

Bridges between interfaces and concrete implementations:

#### CacheAdapter
- Adapts the Cache utility to IImageCache interface
- Allows cache implementation to be swapped

#### OptimizerAdapter
- Adapts ImageOptimizer utility to IImageOptimizer interface
- Enables different optimization strategies

### 4. Utils Layer (`src/utils/`)

Low-level utilities with specific responsibilities:

#### Cache
- Two-tier caching (memory + disk)
- TTL-based expiration
- Size-based cleanup
- Cache key generation

#### ImageOptimizer
- Image format conversion
- Quality optimization
- Size reduction calculations
- Sharp library integration

## Dependency Flow

```
┌─────────────────┐
│   MCP Server    │
└────────┬────────┘
         │
┌────────▼────────┐
│     Tools       │ (image-generation.ts)
└────────┬────────┘
         │ depends on
┌────────▼────────┐
│    Services     │ (ImageGenerator)
└────────┬────────┘
         │ depends on
┌────────▼────────┐
│   Interfaces    │ (IImageCache, IImageOptimizer)
└────────┬────────┘
         │ implemented by
┌────────▼────────┐
│    Adapters     │ (CacheAdapter, OptimizerAdapter)
└────────┬────────┘
         │ wraps
┌────────▼────────┐
│     Utils       │ (Cache, ImageOptimizer)
└─────────────────┘
```

## Testing Architecture

The architecture supports comprehensive testing through:

1. **Dependency Injection**: All dependencies are injected, making mocking trivial
2. **Interface-based Design**: Tests can use mock implementations
3. **Pure Functions**: Many operations are pure, making them easy to test
4. **Isolated Components**: Each component can be tested independently

Example test structure:
```typescript
describe('ImageGenerator', () => {
  let generator: ImageGenerator;
  let mockClient: IOpenAIClient;
  let mockCache: IImageCache;
  
  beforeEach(() => {
    // Create mocks
    mockClient = { generateImage: vi.fn() };
    mockCache = { get: vi.fn(), set: vi.fn() };
    
    // Inject mocks
    generator = new ImageGenerator(mockClient, mockCache, mockOptimizer);
  });
  
  it('should use cache when available', async () => {
    // Test with mocked dependencies
  });
});
```

## Extension Points

The architecture allows easy extension through:

1. **New Image Generators**: Implement `IImageGenerator` for new generation strategies
2. **Alternative Caching**: Implement `IImageCache` for Redis, Memcached, etc.
3. **Different Optimizers**: Implement `IImageOptimizer` for different optimization libraries
4. **Additional Clients**: Implement `IOpenAIClient` for other AI providers

## Benefits

1. **Maintainability**: Clear separation of concerns makes code easy to understand
2. **Testability**: 98%+ test coverage for core utilities
3. **Flexibility**: Easy to swap implementations
4. **Scalability**: Components can be scaled independently
5. **Type Safety**: Full TypeScript support with interfaces

## Future Considerations

1. **Event-Driven Architecture**: Consider event bus for decoupling
2. **Repository Pattern**: Abstract data access for image storage
3. **Strategy Pattern**: For different generation algorithms
4. **Plugin System**: Dynamic loading of processors
5. **Microservices**: Components could be separated into services