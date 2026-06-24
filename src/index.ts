import 'dotenv/config';
import express from 'express';
import { createRouter } from './routes';
import { FilesystemStorage, R2Storage } from './storage';
import { config, isR2Configured } from './config';

const app = express();

const storage = isR2Configured() ? new R2Storage() : new FilesystemStorage();
const router = createRouter(storage);

// Trust proxy headers (Railway sets these)
app.set('trust proxy', true);

// Attach the same router at root; subdomain detection reads Host header.
app.use('/', router);

app.listen(config.port, () => {
  console.log(`Pin running on port ${config.port}`);
  console.log(`Storage: ${isR2Configured() ? 'R2' : 'filesystem'}`);
});
