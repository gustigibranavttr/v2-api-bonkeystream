const { fetchPage, parseArchiveCards, parsePagination } = require('./baseScraper');

/**
 * Search anime by query.
 * @param {string} query
 * @param {number} page
 */
async function scrapeSearch(query, page = 1) {
  const path = page > 1
    ? `/page/${page}/?s=${encodeURIComponent(query)}`
    : `/?s=${encodeURIComponent(query)}`;

  const $ = await fetchPage(path);
  const results = parseArchiveCards($);
  const pagination = parsePagination($);

  // Get result count
  const countText = $('.result-count span').text().trim();
  const totalResults = countText ? parseInt(countText, 10) : results.length;

  return { results, totalResults, pagination };
}

module.exports = { scrapeSearch };
