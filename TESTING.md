# Testing Guide

This document provides comprehensive guidance on testing practices, test structure, and coverage goals for the MCP Server GPT Image-1 project.

## Testing Philosophy

We follow **Test-Driven Development (TDD)** practices:
1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

## Testing Stack

- **Framework**: [Vitest](https://vitest.dev/) - Fast, ESM-first test runner
- **Coverage**: @vitest/coverage-v8 - V8-based coverage reporting
- **Mocking**: Vitest's built-in mocking capabilities
- **Assertions**: Vitest's expect API (Jest-compatible)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/utils/cache.test.ts

# Run tests matching pattern
npm test -- --grep "should generate image"

# Run tests with UI
npm run test:ui
```

## Test Structure

Tests are colocated with source files using the `.test.ts` suffix:

```
src/
├── services/
│   ├── image-generator.ts
│   ├── image-generator.test.ts    # Unit tests
│   ├── streaming-image-generator.ts
│   └── streaming-image-generator.test.ts
├── utils/
│   ├── cache.ts
│   ├── cache.test.ts
│   ├── image-optimizer.ts
│   └── image-optimizer.test.ts
└── server.test.ts                  # Integration tests
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageOptimizer } from './image-optimizer';

describe('ImageOptimizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('optimizeBase64', () => {
    it('should optimize image with compression', async () => {
      // Arrange
      const base64Image = 'valid-base64-data';
      const options = { quality: 80, format: 'jpeg' };
      
      // Act
      const result = await ImageOptimizer.optimizeBase64(base64Image, options);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).not.toBe(base64Image);
    });
  });
});
```

### Integration Test Example

```typescript
describe('MCP Server Integration', () => {
  let server: Server;
  let client: Client;

  beforeEach(async () => {
    const transport = new InMemoryTransport();
    server = createMCPServer();
    client = new Client();
    await Promise.all([
      server.connect(transport[0]),
      client.connect(transport[1])
    ]);
  });

  it('should handle generate_image tool call', async () => {
    const result = await client.request({
      method: 'tools/call',
      params: {
        name: 'generate_image',
        arguments: { prompt: 'A sunset' }
      }
    });
    
    expect(result.content).toBeDefined();
  });
});
```

## Mocking Strategies

### 1. Interface-Based Mocking

```typescript
// Create mock that implements interface
const mockCache: IImageCache = {
  get: vi.fn(),
  set: vi.fn()
};

// Use in tests
const generator = new ImageGenerator(mockClient, mockCache, mockOptimizer);
```

### 2. Module Mocking

```typescript
// Mock entire module
vi.mock('./utils/cache', () => ({
  imageCache: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn()
  }
}));
```

### 3. Partial Mocking

```typescript
// Mock specific methods
vi.spyOn(console, 'log').mockImplementation(() => {});
```

## Test Coverage

### Current Coverage Stats

| Component | Statement Coverage | Branch Coverage | Function Coverage |
|-----------|-------------------|-----------------|-------------------|
| Utils | 98.88% | 95.45% | 100% |
| Services | 78.91% | 86.84% | 95.65% |
| Server | 96.08% | 78.12% | 50% |
| **Overall** | ~50% | ~87% | ~86% |

### Coverage Goals

- **Minimum**: 80% statement coverage
- **Target**: 90% statement coverage
- **Critical paths**: 100% coverage

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual components in isolation

**Characteristics**:
- Fast execution (<100ms)
- No external dependencies
- Mock all dependencies
- Test edge cases

**Example files**:
- `image-optimizer.test.ts` (21 tests)
- `cache.test.ts` (21 tests)
- `image-generator.test.ts` (12 tests)

### 2. Integration Tests

**Purpose**: Test component interactions

**Characteristics**:
- Test real component integration
- May use in-memory implementations
- Focus on component boundaries

**Example files**:
- `server.test.ts` (15 tests)

### 3. Streaming Tests

**Purpose**: Test async generators and streaming

**Characteristics**:
- Test event sequences
- Verify progress updates
- Handle async iteration

**Example files**:
- `streaming-image-generator.test.ts` (12 tests)

## Best Practices

### 1. Test Organization

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should handle success case', () => {});
    it('should handle error case', () => {});
    it('should validate input', () => {});
  });
});
```

### 2. Descriptive Test Names

```typescript
// ❌ Bad
it('test1', () => {});

// ✅ Good
it('should return cached result when available', () => {});
```

### 3. AAA Pattern

```typescript
it('should optimize image', async () => {
  // Arrange
  const input = createTestInput();
  const expected = createExpectedOutput();
  
  // Act
  const result = await optimizer.optimize(input);
  
  // Assert
  expect(result).toEqual(expected);
});
```

### 4. Test Data Builders

```typescript
function createTestImageInput(overrides = {}): ImageGenerationInput {
  return {
    prompt: 'Test prompt',
    size: '1024x1024',
    quality: 'high',
    ...overrides
  };
}
```

### 5. Async Testing

```typescript
// For promises
it('should handle async operation', async () => {
  const result = await asyncOperation();
  expect(result).toBeDefined();
});

// For async generators
it('should stream events', async () => {
  const events = [];
  for await (const event of streamingGenerator()) {
    events.push(event);
  }
  expect(events).toHaveLength(5);
});
```

## Common Testing Patterns

### 1. Testing Error Handling

```typescript
it('should handle API errors gracefully', async () => {
  mockClient.generateImage.mockRejectedValue(new Error('API Error'));
  
  await expect(generator.generate(input))
    .rejects.toThrow('API Error');
});
```

### 2. Testing Streaming

```typescript
async function collectEvents(generator: AsyncGenerator<any>) {
  const events = [];
  for await (const event of generator) {
    events.push(event);
  }
  return events;
}

it('should emit progress events', async () => {
  const events = await collectEvents(
    streamingGenerator.generateWithStreaming(input)
  );
  
  const progressEvents = events.filter(e => e.type === 'progress');
  expect(progressEvents).toHaveLength(4);
});
```

### 3. Testing with Mocked Time

```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should expire cache after TTL', async () => {
  await cache.set('key', data);
  
  // Advance time past TTL
  vi.advanceTimersByTime(3600 * 1000);
  
  const result = await cache.get('key');
  expect(result).toBeNull();
});
```

## Debugging Tests

### 1. Focus on Single Test

```typescript
// Only run this test
it.only('should debug this test', () => {});

// Skip this test
it.skip('should skip this test', () => {});
```

### 2. Debug Output

```typescript
it('should process data', () => {
  const result = processData(input);
  console.log('Result:', result); // Will show in test output
  expect(result).toBeDefined();
});
```

### 3. VS Code Debugging

Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "${file}"],
  "console": "integratedTerminal"
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

## Performance Considerations

1. **Parallel Execution**: Tests run in parallel by default
2. **Test Isolation**: Each test file runs in isolation
3. **Mock Reset**: Always reset mocks in `beforeEach`
4. **Resource Cleanup**: Clean up resources in `afterEach`

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure `.js` extensions in imports
2. **Mock Not Working**: Check mock is defined before import
3. **Async Timeout**: Increase timeout for slow operations
4. **Type Errors**: Use type assertions for test data

### Tips

- Run tests frequently during development
- Write tests before fixing bugs
- Keep tests simple and focused
- Refactor tests along with code
- Review test coverage regularly