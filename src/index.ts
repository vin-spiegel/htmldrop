import 'dotenv/config';
import express from 'express';
import { createRouter } from './routes';
import { FilesystemStorage, R2Storage } from './storage';
import { config, isR2Configured } from './config';
import { mcpGetHandler, mcpPostHandler } from './mcp-sse';
import { landingPageHtml } from './landing';

const app = express();

const storage = isR2Configured() ? new R2Storage() : new FilesystemStorage();
const router = createRouter(storage);

app.set('trust proxy', true);

// Landing page at root
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.status(200).send(landingPageHtml());
});

// MCP over SSE at /mcp
app.get('/mcp', (req, res) => {
  mcpGetHandler(req, res);
});
app.post('/mcp', express.json(), async (req, res) => {
  await mcpPostHandler(req, res, req.body);
});

// Rest of the API and viewer routes
app.use('/', router);

app.listen(config.port, () => {
  console.log(`Pin running on port ${config.port}`);
  console.log(`Storage: ${isR2Configured() ? 'R2' : 'filesystem'}`);
});
