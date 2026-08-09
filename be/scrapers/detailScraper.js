const { fetchPage } = require('./baseScraper');
const { BASE_URL } = require('../config');

/**
 * Scrape anime detail page (watch page) with streaming links.
 * @param {string} slug - anime slug (e.g., "naruto-sub-indo")
 */
async function scrapeDetail(slug) {
  const url = `${BASE_URL}/${slug}/`;
  const $ = await fetchPage(url);

  const title = $('.title_nonton').text().trim() || $('h1.title').text().trim();
  const thumb = $('.video-streaming img').attr('src') || $('article .thumb img').attr('src') || '';
  const synopsis = $('.info_sinopsis').text().trim();

  // Parse info block
  const info = {};
  $('.info2 .infox .info-content .info-content-a p, .info-content p').each((i, el) => {
    const text = $(el).text().trim();
    const split = text.split(':');
    if (split.length > 1) {
      const key = split[0].trim();
      const value = split.slice(1).join(':').trim();
      if (key) info[key] = value;
    }
  });

  // Parse genres from category links
  const genres = [];
  $('a[href*="/category/"]').each((i, el) => {
    const g = $(el).text().trim();
    if (g && !genres.includes(g)) genres.push(g);
  });

  // Parse episodes with streaming data (base64 encoded)
  const episodes = [];
  $('.list_eps_stream li.select-eps').each((i, el) => {
    const epsTitle = $(el).text().trim();
    const rawData = $(el).attr('data');

    let streams = [];
    if (rawData) {
      try {
        const decoded = Buffer.from(rawData, 'base64').toString('utf-8');
        streams = JSON.parse(decoded);
      } catch (e) {
        // skip bad data
      }
    }

    episodes.push({ title: epsTitle, streams });
  });

  // Parse download links if available
  const downloads = [];
  $('.download-eps .download-link, .smokeddl .smokeurl').each((i, el) => {
    const quality = $(el).find('strong').text().trim();
    const links = [];
    $(el).find('a').each((j, a) => {
      const name = $(a).text().trim();
      const href = $(a).attr('href');
      if (name && href) links.push({ name, url: href });
    });
    if (quality || links.length > 0) {
      downloads.push({ quality, links });
    }
  });

  return {
    title,
    slug,
    thumb,
    synopsis,
    info,
    genres,
    totalEpisodes: episodes.length,
    episodes,
    downloads
  };
}

module.exports = { scrapeDetail };
