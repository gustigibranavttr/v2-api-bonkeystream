const router = require('express').Router();
const { success, error } = require('../middleware/responseWrapper');
const { scrapeHome } = require('../scrapers/homeScraper');

/** @swagger /api/home */
router.get('/', async (req, res, next) => {
  try {
    const data = await scrapeHome();
    return success(res, data, 'Latest anime updates');
  } catch (err) { next(err); }
});

module.exports = router;
