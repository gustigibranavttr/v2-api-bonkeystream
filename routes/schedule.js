const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapeSchedule } = require('../scrapers/scheduleScraper');

router.get('/', async (req, res, next) => {
  try {
    const data = await scrapeSchedule();
    return success(res, data, 'Ongoing anime schedule');
  } catch (err) { next(err); }
});

module.exports = router;
