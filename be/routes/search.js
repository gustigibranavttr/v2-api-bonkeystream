const router = require('express').Router();
const { success, error } = require('../middleware/responseWrapper');
const { scrapeSearch } = require('../scrapers/searchScraper');

router.get('/', async (req, res, next) => {
  try {
    const { q, page } = req.query;
    if (!q || q.trim() === '') {
      return error(res, 'Query parameter "q" is required', 400);
    }
    const data = await scrapeSearch(q.trim(), parseInt(page, 10) || 1);
    return success(res, data, `Search results for "${q}"`);
  } catch (err) { next(err); }
});

module.exports = router;
