const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapeBD } = require('../scrapers/taxonomyScraper');

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await scrapeBD(page);
    return success(res, data, 'Bluray Disc anime list');
  } catch (err) { next(err); }
});

module.exports = router;
