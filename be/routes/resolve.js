const router = require('express').Router();
const axios = require('axios');
const { error } = require('../middleware/responseWrapper');

/**
 * @swagger
 * /api/resolve:
 *   get:
 *     summary: Resolve Nimegami HTML stream URL to direct MP4 URL
 *     description: Takes the streaming URL returned by the watch endpoint and resolves it to a direct .mp4 file. Returns a 302 redirect to the MP4 file so it can be used directly in a `<video src="...">` tag.
 *     tags: [Streaming]
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: The streaming URL from Nimegami (e.g. https://stordl.halahgan.com/streaming//DraTrL...)
 *     responses:
 *       302:
 *         description: Redirects to the direct MP4 file.
 *       400:
 *         description: Missing URL parameter.
 *       500:
 *         description: Failed to resolve URL.
 */
router.get('/', async (req, res, next) => {
  try {
    const streamUrl = req.query.url;
    if (!streamUrl) {
      return error(res, 'Missing url parameter', 400);
    }

    // Extract ID from URLs like https://stordl.halahgan.com/streaming//DraTrL?name=...
    // The ID is between /streaming// and the ? mark.
    const match = streamUrl.match(/\/streaming\/\/([^\?]+)/);
    
    if (!match || !match[1]) {
      return error(res, 'Invalid stream URL format', 400);
    }

    const id = match[1];
    
    // Nimegami's hidden API to get the direct URL
    const apiUrl = `https://stordl.halahgan.com/streaming//${id}?action=stream-url&id=${id}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': streamUrl
      }
    });

    if (response.data && response.data.ok && response.data.url) {
      // Redirect the browser/player directly to the MP4 file
      return res.redirect(302, response.data.url);
    }

    return error(res, 'Failed to resolve direct URL from host', 500);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
