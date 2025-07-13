# Contributing to MCP Server GPT Image

First off, thank you for considering contributing to MCP Server GPT Image! It's people like you that make this project better.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include logs and error messages if any

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include comprehensive tests with good coverage
* Tests must pass before PR review
* Document new code and update existing docs
* Follow SOLID principles for new components
* End all files with a newline

#### PR Checklist

- [ ] Tests written and passing
- [ ] Test coverage ≥ 80% for new code
- [ ] TypeScript types properly defined
- [ ] Documentation updated
- [ ] No console.logs or debugging code
- [ ] Error handling implemented
- [ ] SOLID principles followed

## Development Process

### Test-Driven Development (TDD)

We follow TDD practices for all new features and bug fixes:

1. **Write the test first** - Define what success looks like
2. **Run the test** - Ensure it fails (Red phase)
3. **Write minimal code** - Just enough to pass the test (Green phase)
4. **Refactor** - Improve code quality while keeping tests green
5. **Repeat** - Continue until feature is complete

### Development Workflow

1. Fork the repo and create your branch from `main`
2. Set up your development environment:
   ```bash
   npm install
   cp .env.example .env  # Add your OpenAI API key
   ```
3. **Write tests first** for your feature/fix
4. Implement the feature following SOLID principles
5. Ensure all tests pass: `npm test`
6. Check test coverage: `npm run test:coverage`
7. Run type checking: `npm run typecheck`
8. Update documentation if needed
9. Commit with clear, descriptive messages
10. Push to your fork and create a Pull Request

### Code Quality Standards

- **Test Coverage**: Maintain minimum 80% coverage for new code
- **SOLID Principles**: Follow the architecture patterns in [ARCHITECTURE.md](ARCHITECTURE.md)
- **Dependency Injection**: Use interfaces for all dependencies
- **Type Safety**: No `any` types without justification
- **Error Handling**: Proper error handling with meaningful messages

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use TypeScript strict mode
* Prefer `const` over `let`
* Use meaningful variable names
* Add types to all function parameters and return values
* Use async/await over promises when possible
* Define interfaces for all service contracts
* Avoid `any` type - use `unknown` if type is truly unknown
* Use type guards for runtime type checking
* Prefer composition over inheritance

### Testing Styleguide

* Follow AAA pattern: Arrange, Act, Assert
* Use descriptive test names that explain the behavior
* One assertion per test when possible
* Mock external dependencies
* Test edge cases and error conditions
* Use test data builders for complex objects
* Group related tests with `describe` blocks

Example:
```typescript
describe('ImageGenerator', () => {
  describe('generate', () => {
    it('should return cached result when available', async () => {
      // Arrange
      const cachedResult = { images: ['cached-image'] };
      mockCache.get.mockResolvedValue(cachedResult);
      
      // Act
      const result = await generator.generate(input);
      
      // Assert
      expect(result).toEqual(cachedResult);
    });
  });
});
```

### Documentation Styleguide

* Use Markdown
* Reference functions and classes in backticks: \`functionName()\`
* Include code examples when relevant

## Testing Your Changes

### Running Tests Locally

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm test -- --watch

# Run tests for a specific file
npm test -- src/utils/cache.test.ts

# Check coverage
npm run test:coverage
```

### Writing New Tests

See [TESTING.md](TESTING.md) for comprehensive testing guidelines.

## Architecture Guidelines

Please read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the project structure and design principles.

### Key Principles

1. **Single Responsibility**: Each class should have one reason to change
2. **Dependency Injection**: Depend on abstractions, not concretions
3. **Interface Segregation**: Create focused interfaces
4. **Open/Closed**: Open for extension, closed for modification

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `needs tests` - PR needs test coverage
* `breaking change` - Introduces breaking changes

### Getting Help

If you need help:

1. Check the [documentation](README.md)
2. Search [existing issues](https://github.com/pavelsukhachev/mcp-server-gpt-image/issues)
3. Ask in discussions
4. Create an issue with your question

Thank you for contributing! 🎉