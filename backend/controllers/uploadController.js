const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { processPdf } = require('../services/pdfService');
const { processWebsite } = require('../services/webService');
const { processYoutube, extractVideoId } = require('../services/youtubeService');
const { generateEmbeddings } = require('../services/embeddingService');
const { addDocuments } = require('../services/chromaService');
const { addSource } = require('../utils/sourceStore');

/**
 * POST /api/upload/pdf
 * Handles PDF file upload, text extraction, chunking, embedding, storage.
 */
async function uploadPdf(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  const sourceId = uuidv4();
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    console.log(`📄 Ingesting PDF: ${fileName}`);
    const chunks = await processPdf(filePath);
    if (!chunks.length) throw new Error('No content extracted from PDF.');

    console.log(`  → ${chunks.length} chunks. Generating embeddings...`);
    const embeddings = await generateEmbeddings(chunks);

    await addDocuments(sourceId, chunks, embeddings, { name: fileName, type: 'pdf', url: null });

    const source = addSource({
      id: sourceId,
      name: fileName,
      type: 'pdf',
      url: null,
      chunkCount: chunks.length,
      createdAt: new Date().toISOString(),
    });

    // Remove temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, source, message: `PDF ingested. ${chunks.length} chunks stored.` });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw err;
  }
}

/**
 * POST /api/upload/website
 * Handles website URL ingestion: scrape, chunk, embed, store.
 */
async function uploadWebsite(req, res) {
  const { url } = req.body;
  if (!url || !url.trim()) return res.status(400).json({ error: 'Website URL is required.' });

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  const sourceId = uuidv4();
  const hostname = new URL(url).hostname.replace('www.', '');

  console.log(`🌐 Ingesting website: ${url}`);
  const chunks = await processWebsite(url);
  if (!chunks.length) return res.status(400).json({ error: 'No content extracted from website.' });

  const embeddings = await generateEmbeddings(chunks);
  await addDocuments(sourceId, chunks, embeddings, { name: hostname, type: 'website', url });

  const source = addSource({
    id: sourceId,
    name: hostname,
    type: 'website',
    url,
    chunkCount: chunks.length,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, source, message: `Website ingested. ${chunks.length} chunks stored.` });
}

/**
 * POST /api/upload/youtube
 * Handles YouTube URL ingestion: transcript, chunk, embed, store.
 */
async function uploadYoutube(req, res) {
  const { url } = req.body;
  if (!url || !url.trim()) return res.status(400).json({ error: 'YouTube URL is required.' });

  const videoId = extractVideoId(url);
  const sourceId = uuidv4();

  console.log(`🎬 Ingesting YouTube video: ${videoId}`);
  const chunks = await processYoutube(url);
  if (!chunks.length) return res.status(400).json({ error: 'No transcript found for this video.' });

  const embeddings = await generateEmbeddings(chunks);
  const sourceName = `YouTube: ${videoId}`;
  await addDocuments(sourceId, chunks, embeddings, { name: sourceName, type: 'youtube', url });

  const source = addSource({
    id: sourceId,
    name: sourceName,
    type: 'youtube',
    url,
    chunkCount: chunks.length,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, source, message: `YouTube transcript ingested. ${chunks.length} chunks stored.` });
}

module.exports = { uploadPdf, uploadWebsite, uploadYoutube };
