import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
const rawCors = env.CORS_ORIGIN || '*';
const allowedOrigins = rawCors.split(',').map(o => o.trim().replace(/\/+$/, '')).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server) or wildcard
    if (!origin || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    const cleanOrigin = origin.trim().replace(/\/+$/, '');
    const isMatch = allowedOrigins.some(allowed => {
      if (cleanOrigin === allowed) return true;
      // Also match www / non-www variant
      const withWww = allowed.replace('://', '://www.');
      const withoutWww = allowed.replace('://www.', '://');
      return cleanOrigin === withWww || cleanOrigin === withoutWww;
    });

    if (isMatch) {
      return callback(null, true);
    }
    return callback(new Error(`Blocked by CORS for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default health check aliases for Render / Cloud load balancers (/healthz, /health)
app.get(['/healthz', '/health'], (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'EVA Backend API' });
});

// Request Logger in development
if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes mount
app.use('/api', apiRoutes);

// Static frontend serving if built
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log(`[Server] Serving production frontend build from: ${frontendDist}`);
  
  // Disable caching for index.html and SPA routes so updates appear immediately
  app.use((req, res, next) => {
    if (req.method === 'GET' && (req.path === '/' || req.path.endsWith('.html') || !req.originalUrl.startsWith('/api'))) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });

  app.use(express.static(frontendDist, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      }
    }
  }));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
} else {
  // 404 Route handler for development when dist is not built
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found.`
    });
  });
}

// Centralized Error Handler
app.use(errorHandler);

const PORT = env.PORT;

// Start server if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const server = app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`  EVA Platform Backend Server running on port ${PORT}`);
    console.log(`  Full-Stack Application: http://localhost:${PORT}`);
    console.log(`  API Health check: http://localhost:${PORT}/api/health`);
    console.log(`  Environment: ${env.NODE_ENV}`);
    console.log('====================================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[Server Error] Port ${PORT} is already in use by another process.`);
      console.error(`Please stop the existing process on port ${PORT} or configure PORT in your .env file.\n`);
      process.exit(1);
    } else {
      console.error('\n[Server Error] Failed to start server:', err);
      process.exit(1);
    }
  });

  const shutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] Active connections closed. Goodbye!');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

export default app;
