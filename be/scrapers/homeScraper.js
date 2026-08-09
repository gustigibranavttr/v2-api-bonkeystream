const { fetchPage, parseHomeCards } = require('./baseScraper');

/**
 * Scrape homepage for latest anime updates.
 */
async function scrapeHome() {
  const $ = await fetchPage('/');
  return parseHomeCards($);
}

/**
 * Scrape popular/recommended (sticky) posts from homepage.
 */
async function scrapePopular() {
  const $ = await fetchPage('/');
  const results = [];
  $('.post-article article.stiky_post').each((i, el) => {
    const title = $(el).find('h2[itemprop="name"] a').text().trim();
    const link = $(el).find('h2[itemprop="name"] a').attr('href');
    const slug = link ? link.replace('https://nimegami.id/', '').replace(/\//g, '') : '';
    const imgEl = $(el).find('.thumb img');
    const thumb = imgEl.attr('src') || '';
    const rating = $(el).find('.rating').text().trim();

    if (title && link) {
      results.push({ title, slug, link, thumb, rating });
    }
  });
  return results;
}

/**
 * Scrape ongoing anime from sidebar (available on archive pages).
 */
async function scrapeOngoing() {
  const $ = await fetchPage('/type-list/');
  const results = [];
  $('aside.sidebarwidget.list ul li').each((i, el) => {
    const a = $(el).find('a');
    const title = a.attr('title') || a.text().trim();
    const link = a.attr('href');
    const slug = link ? link.replace('https://nimegami.id/', '').replace(/\//g, '') : '';
    const text = a.text().trim();
    const epMatch = text.match(/#(\d+)$/);
    const latestEpisode = epMatch ? parseInt(epMatch[1], 10) : null;

    if (title && link) {
      results.push({ title: title.trim(), slug, link, latestEpisode });
    }
  });
  return results;
}

module.exports = { scrapeHome, scrapePopular, scrapeOngoing };
