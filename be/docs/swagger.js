const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BonkeyStreamV2 API',
      version: '1.0.0',
      description: 'REST API for streaming anime data scraped from Nimegami.id',
      contact: { name: 'BonkeyStream' }
    },
    servers: [
      { url: 'https://v2-api-bonkeystream.vercel.app', description: 'Production' },
      { url: 'http://localhost:3000', description: 'Development' }
    ],
    tags: [
      { name: 'Home', description: 'Homepage & updates' },
      { name: 'Search', description: 'Search anime' },
      { name: 'Taxonomy', description: 'Type, Season, Genre lists' },
      { name: 'Browse', description: 'BD, Movie, Schedule' },
      { name: 'Detail', description: 'Watch & streaming' },
    ],
    paths: {
      '/api/home': {
        get: {
          tags: ['Home'],
          summary: 'Get latest anime updates',
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/search': {
        get: {
          tags: ['Search'],
          summary: 'Search anime by query',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search keyword' },
            { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } }
          ],
          responses: { 200: { description: 'Success' }, 400: { description: 'Missing query' } }
        }
      },
      '/api/list-type': {
        get: {
          tags: ['Taxonomy'],
          summary: 'List all anime types',
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/type/{slug}': {
        get: {
          tags: ['Taxonomy'],
          summary: 'Get anime by type',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'tv' },
            { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } }
          ],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/list-season': {
        get: {
          tags: ['Taxonomy'],
          summary: 'List all seasons',
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/season/{slug}': {
        get: {
          tags: ['Taxonomy'],
          summary: 'Get anime by season',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'summer-2026' },
            { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } }
          ],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/list-genre': {
        get: {
          tags: ['Taxonomy'],
          summary: 'List all genres',
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/genre/{slug}': {
        get: {
          tags: ['Taxonomy'],
          summary: 'Get anime by genre',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'action' },
            { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } }
          ],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/bd': {
        get: {
          tags: ['Browse'],
          summary: 'Get Bluray Disc anime list',
          parameters: [
            { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } }
          ],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/movie': {
        get: {
          tags: ['Browse'],
          summary: 'Get anime movie list',
          parameters: [
            { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } }
          ],
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/schedule': {
        get: {
          tags: ['Browse'],
          summary: 'Get ongoing anime schedule',
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/watch/{slug}': {
        get: {
          tags: ['Detail'],
          summary: 'Get anime detail + streaming links',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'naruto-sub-indo' }
          ],
          responses: { 200: { description: 'Success' }, 400: { description: 'Missing slug' } }
        }
      },
      '/api/ongoing': {
        get: {
          tags: ['Home'],
          summary: 'Get ongoing anime list',
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/popular': {
        get: {
          tags: ['Home'],
          summary: 'Get popular/recommended anime',
          responses: { 200: { description: 'Success' } }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
