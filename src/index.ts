import 'dotenv/config';
import { runStdioServer } from './server.js';
import { createHTTPServer } from './transport/http.js';

// Check for required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

// Determine transport mode
const transportMode = process.argv[2] || 'stdio';

async function main() {
  switch (transportMode) {
    case 'stdio':
      // Run in stdio mode (for Claude Desktop, etc.)
      await runStdioServer();
      break;
      
    case 'http':
      // Run in HTTP mode (for remote access)
      const port = parseInt(process.env.PORT || '3000', 10);
      createHTTPServer(port);
      break;
      
    default:
      console.error(`Unknown transport mode: ${transportMode}`);
      console.error('Usage: node dist/index.js [stdio|http]');
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});