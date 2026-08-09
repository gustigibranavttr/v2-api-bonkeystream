const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerSpec = require('./docs/swagger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const { PORT } = require('./config');

const app = express();

// ── Security & Middleware ──────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// ── API Docs (Scalar) ─────────────────────────────────────────
app.use('/docs', async (req, res, next) => {
  try {
    const { apiReference } = await import('@scalar/express-api-reference');
    const middleware = apiReference({
      theme: 'kepler',
      layout: 'modern',
      pageTitle: 'BonkeyStreamV2 API Docs',
      spec: {
        content: swaggerSpec,
      },
    });
    return middleware(req, res, next);
  } catch (err) {
    next(err);
  }
});

// ── API Routes ─────────────────────────────────────────────
app.use('/api', routes);

// ── Root ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'BonkeyStreamV2',
    version: '1.0.0',
    description: 'REST API for streaming anime data from Nimegami.id',
    docs: '/docs',
    endpoints: {
      home: '/api/home',
      search: '/api/search?q=naruto',
      listType: '/api/list-type',
      type: '/api/type/:slug',
      listSeason: '/api/list-season',
      season: '/api/season/:slug',
      listGenre: '/api/list-genre',
      genre: '/api/genre/:slug',
      bd: '/api/bd',
      movie: '/api/movie',
      schedule: '/api/schedule',
      watch: '/api/watch/:slug',
      ongoing: '/api/ongoing',
      popular: '/api/popular'
    }
  });
});

// ── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// ── Error Handler ───────────────────────────────────────────
app.use(errorHandler);

// ── Start (Hanya jalan di environment lokal) ───────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════╗
    ║    BonkeyStreamV2 API                     ║
    ║   Running on: http://localhost:${PORT}          ║
    ║   Docs:       http://localhost:${PORT}/docs     ║
    ╚══════════════════════════════════════════════╝
    `);
  });
}

// ── Export untuk Vercel Serverless ──────────────────────────
module.exports = app;
