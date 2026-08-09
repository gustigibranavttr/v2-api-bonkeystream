const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapePopular } = require('../scrapers/homeScraper');

router.get('/', async (req, res, next) => {
  try {
    const data = await scrapePopular();
    return success(res, data, 'Popular / recommended anime');
  } catch (err) { next(err); }
});

module.exports = router;
