const router = require('express').Router();
const { success, error } = require('../middleware/responseWrapper');
const { scrapeDetail } = require('../scrapers/detailScraper');

router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug || slug.trim() === '') {
      return error(res, 'Slug parameter is required', 400);
    }
    const data = await scrapeDetail(slug.trim());
    return success(res, data, `Detail for ${data.title || slug}`);
  } catch (err) { next(err); }
});

module.exports = router;
