const router = require('express').Router();
const { success } = require('../middleware/responseWrapper');
const { scrapeGenreList, scrapeByGenre } = require('../scrapers/taxonomyScraper');

router.get('/list-genre', async (req, res, next) => {
  try {
    const data = await scrapeGenreList();
    return success(res, data, 'All genres');
  } catch (err) { next(err); }
});

router.get('/genre/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const data = await scrapeByGenre(slug, page);
    return success(res, data, `Anime by genre: ${slug}`);
  } catch (err) { next(err); }
});

module.exports = router;
