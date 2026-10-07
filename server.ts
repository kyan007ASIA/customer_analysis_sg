import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import healthHandler from './api/health.js';
import onemapHandler from './api/onemap.js';
import onemapSearchHandler from './api/onemap/search.js';
import onemapTokenHandler from './api/onemap/token.js';
import onemapRevgeocodeHandler from './api/onemap/revgeocode.js';
import apiIndexHandler from './api/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API endpoints mounted using serverless-compatible handlers
app.all('/api/health', (req, res) => healthHandler(req, res));
app.all('/api/health.js', (req, res) => healthHandler(req, res));
app.all('/api/onemap/search', (req, res) => onemapSearchHandler(req, res));
app.all('/api/onemap/token', (req, res) => onemapTokenHandler(req, res));
app.all('/api/onemap/revgeocode', (req, res) => onemapRevgeocodeHandler(req, res));
app.all('/api/onemap', (req, res) => onemapHandler(req, res));
app.all('/api', (req, res) => apiIndexHandler(req, res));

// Vite middleware integration in dev, static files in production
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lion City Spatial Intelligence server running on port ${PORT}`);
});
