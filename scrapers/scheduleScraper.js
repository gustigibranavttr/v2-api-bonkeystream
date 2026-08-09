const { fetchPage } = require('./baseScraper');

/**
 * Scrape anime schedule / jadwal rilis page.
 */
async function scrapeSchedule() {
  const $ = await fetchPage('/anime-terbaru-sub-indo/');

  const schedule = [];

  // The schedule page typically has day-based sections
  $('.schedule-item, .jadwal-item, .content .box-jadwal, article').each((i, el) => {
    const title = $(el).find('h2 a, h3 a, .tt a, a').first().text().trim();
    const link = $(el).find('h2 a, h3 a, .tt a, a').first().attr('href');
    const slug = link ? link.replace('https://nimegami.id/', '').replace(/\//g, '') : '';

    if (title && link && link.includes('nimegami.id')) {
      schedule.push({ title, slug, link });
    }
  });

  // Deduplicate
  const seen = new Set();
  const unique = schedule.filter(item => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });

  return unique;
}

module.exports = { scrapeSchedule };
