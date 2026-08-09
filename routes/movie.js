const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapeMovie } = require('../scrapers/taxonomyScraper');

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await scrapeMovie(page);
    return success(res, data, 'Anime movie list');
  } catch (err) { next(err); }
});

module.exports = router;
