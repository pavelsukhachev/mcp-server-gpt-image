# Environment Configuration

This document details all environment variables and configuration options for the MCP Server GPT Image-1.

## Required Environment Variables

### `OPENAI_API_KEY`
- **Type**: String
- **Required**: Yes
- **Description**: Your OpenAI API key with access to GPT Image-1
- **Example**: `sk-proj-...`
- **Note**: Must have completed [API Organization Verification](https://help.openai.com/en/articles/10910291-api-organization-verification)

## Optional Environment Variables

### Server Configuration

#### `PORT`
- **Type**: Number
- **Default**: `3000`
- **Description**: HTTP server port
- **Example**: `8080`

#### `CORS_ORIGIN`
- **Type**: String
- **Default**: `*`
- **Description**: CORS allowed origins
- **Example**: `https://yourdomain.com`
- **Note**: Use specific domains in production

#### `NODE_ENV`
- **Type**: String
- **Default**: `development`
- **Options**: `development`, `production`, `test`
- **Description**: Node.js environment mode

#### `LOG_LEVEL`
- **Type**: String
- **Default**: `info`
- **Options**: `debug`, `info`, `warn`, `error`
- **Description**: Logging verbosity level

### Cache Configuration

#### `CACHE_DIR`
- **Type**: String
- **Default**: `.cache/images`
- **Description**: Directory for disk cache storage
- **Example**: `/var/cache/mcp-images`
- **Note**: Directory will be created if it doesn't exist

#### `CACHE_TTL`
- **Type**: Number (seconds)
- **Default**: `3600` (1 hour)
- **Description**: Time-to-live for cache entries
- **Example**: `7200` (2 hours)

#### `CACHE_MAX_SIZE`
- **Type**: Number (MB)
- **Default**: `100`
- **Description**: Maximum disk cache size in megabytes
- **Example**: `500`
- **Note**: Oldest entries are removed when limit is reached

### Image Configuration

#### `DEFAULT_IMAGE_FORMAT`
- **Type**: String
- **Default**: `png`
- **Options**: `png`, `jpeg`, `webp`
- **Description**: Default output format when not specified

#### `DEFAULT_IMAGE_QUALITY`
- **Type**: String
- **Default**: `auto`
- **Options**: `low`, `medium`, `high`, `auto`
- **Description**: Default quality level for image generation

#### `DEFAULT_COMPRESSION_LEVEL`
- **Type**: Number
- **Default**: `85`
- **Range**: `0-100`
- **Description**: Default compression level when not specified

## Configuration Files

### `.env` File Example

Create a `.env` file in the project root:

```env
# Required
OPENAI_API_KEY=sk-proj-your-api-key-here

# Server Configuration
PORT=3000
CORS_ORIGIN=*
NODE_ENV=production
LOG_LEVEL=info

# Cache Configuration
CACHE_DIR=.cache/images
CACHE_TTL=3600
CACHE_MAX_SIZE=100

# Image Defaults
DEFAULT_IMAGE_FORMAT=png
DEFAULT_IMAGE_QUALITY=auto
DEFAULT_COMPRESSION_LEVEL=85
```

### Docker Environment

When using Docker, pass environment variables via:

1. **docker-compose.yml**:
```yaml
environment:
  - OPENAI_API_KEY=${OPENAI_API_KEY}
  - NODE_ENV=production
  - CACHE_TTL=7200
  - CACHE_MAX_SIZE=500
```

2. **Docker run command**:
```bash
docker run -e OPENAI_API_KEY=your-key \
           -e NODE_ENV=production \
           -e PORT=8080 \
           mcp-server-gpt-image
```

3. **env_file**:
```yaml
env_file:
  - .env
  - .env.production
```

### Claude Desktop Configuration

Environment variables in Claude Desktop config:

```json
{
  "mcpServers": {
    "gpt-image": {
      "command": "node",
      "args": ["path/to/dist/index.js", "stdio"],
      "env": {
        "OPENAI_API_KEY": "your-api-key",
        "CACHE_DIR": "/Users/you/.cache/mcp-images",
        "CACHE_TTL": "7200",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

## Environment-Specific Configurations

### Development

```env
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=*
CACHE_TTL=300
```

### Production

```env
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
CACHE_TTL=3600
CACHE_MAX_SIZE=500
```

### Testing

```env
NODE_ENV=test
LOG_LEVEL=error
CACHE_TTL=60
CACHE_MAX_SIZE=10
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment-specific files**:
   - `.env.development`
   - `.env.production`
   - `.env.test`

3. **Secure API keys**:
   - Use secret management services in production
   - Rotate keys regularly
   - Limit key permissions

4. **Validate environment**:
   ```javascript
   if (!process.env.OPENAI_API_KEY) {
     throw new Error('OPENAI_API_KEY is required');
   }
   ```

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY environment variable is required"**
   - Ensure the variable is set in your environment
   - Check for typos in variable name
   - Verify the `.env` file is in the correct location

2. **Cache directory permissions**
   - Ensure the process has write permissions to `CACHE_DIR`
   - Use absolute paths in production

3. **Port already in use**
   - Change `PORT` to an available port
   - Check for other processes using the port

### Debugging Environment

To debug environment loading:

```bash
# Print all environment variables
node -e "console.log(process.env)"

# Check specific variable
echo $OPENAI_API_KEY

# Run with debug logging
LOG_LEVEL=debug npm start
```

## Performance Tuning

### Cache Optimization

For high-traffic deployments:
```env
CACHE_TTL=7200        # 2 hours
CACHE_MAX_SIZE=1000   # 1GB
```

### Memory Usage

For memory-constrained environments:
```env
CACHE_MAX_SIZE=50     # 50MB
NODE_OPTIONS="--max-old-space-size=512"
```

### API Rate Limits

Consider these settings to avoid rate limits:
```env
CACHE_TTL=3600        # Cache for 1 hour
LOG_LEVEL=warn        # Reduce log volume
```