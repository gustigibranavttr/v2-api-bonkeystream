const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const { PORT } = require('./config');

const app = express();

// ── Security & Middleware ──────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// ── Swagger Docs ───────────────────────────────────────────
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customCssUrl: CSS_URL,
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.js'
  ],
  customSiteTitle: 'BonkeyStreamV2 API Docs'
}));

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
