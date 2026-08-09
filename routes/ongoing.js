const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapeOngoing } = require('../scrapers/homeScraper');

router.get('/', async (req, res, next) => {
  try {
    const data = await scrapeOngoing();
    return success(res, data, 'Ongoing anime list');
  } catch (err) { next(err); }
});

module.exports = router;
