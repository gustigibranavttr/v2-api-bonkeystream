const { fetchPage, parseTaxonomyList, parseArchiveCards, parsePagination } = require('./baseScraper');

/**
 * Scrape the type list page.
 */
async function scrapeTypeList() {
  const $ = await fetchPage('/type-list/');
  return parseTaxonomyList($);
}

/**
 * Scrape anime by type slug (e.g., "tv", "movie", "ova").
 */
async function scrapeByType(slug, page = 1) {
  const path = page > 1
    ? `/type/${slug}/page/${page}/`
    : `/type/${slug}/`;
  const $ = await fetchPage(path);
  return { results: parseArchiveCards($), pagination: parsePagination($) };
}

/**
 * Scrape the season list page.
 */
async function scrapeSeasonList() {
  const $ = await fetchPage('/seasons-musim-list/');
  return parseTaxonomyList($);
}

/**
 * Scrape anime by season slug (e.g., "summer-2026").
 */
async function scrapeBySeason(slug, page = 1) {
  const path = page > 1
    ? `/seasons/${slug}/page/${page}/`
    : `/seasons/${slug}/`;
  const $ = await fetchPage(path);
  return { results: parseArchiveCards($), pagination: parsePagination($) };
}

/**
 * Scrape the genre/category list page.
 */
async function scrapeGenreList() {
  const $ = await fetchPage('/genre-category-list/');
  return parseTaxonomyList($);
}

/**
 * Scrape anime by genre/category slug (e.g., "action").
 */
async function scrapeByGenre(slug, page = 1) {
  const path = page > 1
    ? `/category/${slug}/page/${page}/`
    : `/category/${slug}/`;
  const $ = await fetchPage(path);
  return { results: parseArchiveCards($), pagination: parsePagination($) };
}

/**
 * Scrape BD (Bluray Disc) tagged anime.
 */
async function scrapeBD(page = 1) {
  const path = page > 1
    ? `/tag/bd/page/${page}/`
    : `/tag/bd/`;
  const $ = await fetchPage(path);
  return { results: parseArchiveCards($), pagination: parsePagination($) };
}

/**
 * Scrape Movie type anime (shortcut for /type/movie/).
 */
async function scrapeMovie(page = 1) {
  return scrapeByType('movie', page);
}

module.exports = {
  scrapeTypeList, scrapeByType,
  scrapeSeasonList, scrapeBySeason,
  scrapeGenreList, scrapeByGenre,
  scrapeBD, scrapeMovie
};
