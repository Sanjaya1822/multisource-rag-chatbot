/**
 * Splits text into overlapping chunks for embedding.
 * @param {string} text - Input text to chunk
 * @param {number} chunkSize - Target words per chunk (default: 400)
 * @param {number} overlap - Overlapping words between chunks (default: 50)
 * @returns {string[]} Array of text chunks
 */
function splitIntoChunks(text, chunkSize = 400, overlap = 50) {
  // Normalize whitespace
  const cleanText = text.replace(/\s+/g, ' ').trim();
  if (!cleanText) return [];

  const words = cleanText.split(' ');
  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(' ');
    if (chunk.trim().length > 30) {
      chunks.push(chunk);
    }
    // Advance by chunkSize minus overlap
    const advance = chunkSize - overlap;
    start += advance > 0 ? advance : chunkSize;
    if (start >= words.length) break;
  }

  return chunks;
}

module.exports = { splitIntoChunks };
