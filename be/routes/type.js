const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapeTypeList, scrapeByType } = require('../scrapers/taxonomyScraper');

router.get('/list-type', async (req, res, next) => {
  try {
    const data = await scrapeTypeList();
    return success(res, data, 'All anime types');
  } catch (err) { next(err); }
});

router.get('/type/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const data = await scrapeByType(slug, page);
    return success(res, data, `Anime by type: ${slug}`);
  } catch (err) { next(err); }
});

module.exports = router;
