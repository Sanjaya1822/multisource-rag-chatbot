const pdfParse = require('pdf-parse');
const fs = require('fs');
const { splitIntoChunks } = require('../utils/textChunker');

/**
 * Extract raw text from a PDF file
 * @param {string} filePath - Absolute path to the PDF
 * @returns {Promise<string>} Extracted text
 */
async function extractText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

/**
 * Extract text from a PDF and split into chunks
 * @param {string} filePath - Absolute path to the PDF
 * @returns {Promise<string[]>} Array of text chunks
 */
async function processPdf(filePath) {
  const text = await extractText(filePath);
  if (!text || text.trim().length === 0) {
    throw new Error('No text could be extracted from the PDF.');
  }
  return splitIntoChunks(text);
}

module.exports = { extractText, processPdf };
