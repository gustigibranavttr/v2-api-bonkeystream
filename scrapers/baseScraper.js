const axios = require('axios');
const cheerio = require('cheerio');
const { BASE_URL, HEADERS, HTTPS_AGENT } = require('../config');

/**
 * Fetch a page and return a cheerio instance.
 * @param {string} path - relative path or full URL
 * @returns {Promise<import('cheerio').CheerioAPI>}
 */
async function fetchPage(path) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const { data } = await axios.get(url, {
    headers: HEADERS,
    httpsAgent: HTTPS_AGENT,
    timeout: 15000
  });
  return cheerio.load(data);
}

/**
 * Parse anime cards from archive/search pages.
 * Works for search results, type, season, genre, bd, movie pages.
 */
function parseArchiveCards($) {
  const results = [];
  $('.archive .archive-a article').each((i, el) => {
    const title = $(el).find('h2[itemprop="name"] a').text().trim();
    const link = $(el).find('h2[itemprop="name"] a').attr('href');
    const slug = link ? link.replace(BASE_URL, '').replace(/\//g, '') : '';
    const imgEl = $(el).find('.thumbnail img');
    const thumb = imgEl.attr('src') || (imgEl.attr('srcset') ? imgEl.attr('srcset').split(' ')[0] : '');
    const rating = $(el).find('.rating-archive').text().trim();
    const episode = $(el).find('.eps-archive').text().trim();
    const status = $(el).find('.term_tag-a a').text().trim();

    const type = [];
    $(el).find('.terms_tag a').each((j, el2) => {
      type.push($(el2).text().trim());
    });

    if (title && link) {
      results.push({ title, slug, link, thumb, rating, episode, status, type });
    }
  });
  return results;
}

/**
 * Parse anime cards from homepage (sticky post format).
 */
function parseHomeCards($) {
  const results = [];
  $('.post-article article').each((i, el) => {
    const title = $(el).find('h2[itemprop="name"] a').text().trim();
    const link = $(el).find('h2[itemprop="name"] a').attr('href');
    const slug = link ? link.replace(BASE_URL, '').replace(/\//g, '') : '';
    const imgEl = $(el).find('.thumb img');
    const thumb = imgEl.attr('src') || (imgEl.attr('srcset') ? imgEl.attr('srcset').split(' ')[0] : '');
    const rating = $(el).find('.rating').text().trim();
    const statusEl = $(el).find('.bot-post a:nth-child(2)');
    const status = statusEl.text().trim();

    const type = [];
    $(el).find('.bot-post a[href*="/type/"]').each((j, el2) => {
      type.push($(el2).text().trim());
    });

    const genres = [];
    $(el).find('.info ul li').each((j, li) => {
      const label = $(li).find('strong').text().trim();
      if (label === 'Category:') {
        $(li).find('a').each((k, a) => {
          genres.push($(a).text().trim());
        });
      }
    });

    if (title && link) {
      results.push({ title, slug, link, thumb, rating, status, type, genres });
    }
  });
  return results;
}

/**
 * Parse taxonomy list (type, season, genre) from .terms_all links.
 */
function parseTaxonomyList($) {
  const items = [];
  $('.terms_all a').each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    // Extract name and count: "Action (1535)"
    const match = text.match(/^(.+?)\s*\((\d+)\)$/);
    if (match && href) {
      const slug = href.split('/').filter(Boolean).pop();
      items.push({
        name: match[1].trim(),
        slug,
        count: parseInt(match[2], 10),
        link: href
      });
    }
  });
  return items;
}

/**
 * Parse pagination info.
 */
function parsePagination($) {
  const pages = [];
  $('.pagination a.page-numbers, .pagination span.page-numbers').each((i, el) => {
    const text = $(el).text().trim();
    if (/^\d+$/.test(text)) {
      pages.push(parseInt(text, 10));
    }
  });
  const currentPage = parseInt($('.pagination .current').text().trim(), 10) || 1;
  const totalPages = pages.length > 0 ? Math.max(...pages) : 1;
  return { currentPage, totalPages };
}

module.exports = {
  fetchPage,
  parseArchiveCards,
  parseHomeCards,
  parseTaxonomyList,
  parsePagination
};
