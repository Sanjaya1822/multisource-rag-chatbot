const { getSources, deleteSource } = require('../utils/sourceStore');
const { deleteSourceChunks } = require('../services/chromaService');

/**
 * GET /api/sources
 * Returns all ingested sources.
 */
async function listSources(req, res) {
  const sources = getSources();
  res.json({ sources });
}

/**
 * DELETE /api/source/:id
 * Deletes a source and its ChromaDB chunks.
 */
async function removeSource(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Source ID is required.' });

  await deleteSourceChunks(id);
  const remaining = deleteSource(id);

  res.json({ success: true, message: 'Source deleted.', remaining });
}

module.exports = { listSources, removeSource };
