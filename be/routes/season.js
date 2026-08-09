const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapeSeasonList, scrapeBySeason } = require('../scrapers/taxonomyScraper');

router.get('/list-season', async (req, res, next) => {
  try {
    const data = await scrapeSeasonList();
    return success(res, data, 'All seasons');
  } catch (err) { next(err); }
});

router.get('/season/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const data = await scrapeBySeason(slug, page);
    return success(res, data, `Anime by season: ${slug}`);
  } catch (err) { next(err); }
});

module.exports = router;
