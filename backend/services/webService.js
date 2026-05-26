const axios = require('axios');
const cheerio = require('cheerio');
const { splitIntoChunks } = require('../utils/textChunker');

/**
 * Scrape meaningful text from a URL using cheerio
 * @param {string} url - Website URL to scrape
 * @returns {Promise<string>} Extracted text content
 */
async function scrapeWebsite(url) {
  const response = await axios.get(url, {
    timeout: 20000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    maxRedirects: 5,
  });

  const $ = cheerio.load(response.data);

  // Remove noise elements
  $(
    'script, style, nav, footer, header, iframe, noscript, aside, [aria-hidden="true"], .cookie-banner, #cookie-banner'
  ).remove();
  $('[class*="ad-"], [id*="ad-"], [class*="banner"], [class*="popup"]').remove();

  // Extract meaningful content
  const textParts = [];
  $('h1, h2, h3, h4, h5, h6, p, li, td, th, article, main, section').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 30) {
      textParts.push(text);
    }
  });

  let fullText = textParts.join('\n\n');

  // Fallback to raw body text
  if (fullText.trim().length < 100) {
    fullText = $('body').text().replace(/\s+/g, ' ').trim();
  }

  if (!fullText || fullText.trim().length === 0) {
    throw new Error('No content could be extracted from the website.');
  }

  return fullText;
}

/**
 * Process a website URL: scrape + chunk
 * @param {string} url - Website URL
 * @returns {Promise<string[]>} Array of text chunks
 */
async function processWebsite(url) {
  const text = await scrapeWebsite(url);
  return splitIntoChunks(text);
}

module.exports = { scrapeWebsite, processWebsite };
