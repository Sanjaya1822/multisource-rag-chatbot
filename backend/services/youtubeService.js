const { YoutubeTranscript } = require('youtube-transcript');
const { splitIntoChunks } = require('../utils/textChunker');

/**
 * Extract video ID from a YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string} Video ID
 */
function extractVideoId(url) {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  throw new Error('Invalid YouTube URL. Could not extract video ID.');
}

/**
 * Fetch the full transcript from a YouTube video
 * @param {string} url - YouTube video URL
 * @returns {Promise<string>} Combined transcript text
 */
async function getTranscript(url) {
  const videoId = extractVideoId(url);
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  if (!items || items.length === 0) {
    throw new Error('No transcript available for this YouTube video. The video may not have captions enabled.');
  }
  return items.map((item) => item.text).join(' ');
}

/**
 * Process a YouTube URL: fetch transcript + chunk
 * @param {string} url - YouTube video URL
 * @returns {Promise<string[]>} Array of text chunks
 */
async function processYoutube(url) {
  const text = await getTranscript(url);
  return splitIntoChunks(text);
}

module.exports = { extractVideoId, getTranscript, processYoutube };
