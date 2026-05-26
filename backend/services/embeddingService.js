/**
 * Embedding service using @xenova/transformers (all-MiniLM-L6-v2).
 * Uses dynamic import since @xenova/transformers is an ES module.
 */

let extractor = null;

/**
 * Lazily initialize the feature-extraction pipeline.
 * Model is downloaded on first call and cached afterwards.
 */
async function getExtractor() {
  if (extractor) return extractor;

  console.log('🔄 Loading embedding model (first run may take a moment)...');
  const { pipeline } = await import('@xenova/transformers');
  extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
  });
  console.log('✅ Embedding model loaded: all-MiniLM-L6-v2');
  return extractor;
}

/**
 * Generate a 384-dimensional embedding for a text string.
 * @param {string} text - Input text
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(text) {
  const pipe = await getExtractor();
  const output = await pipe(text.slice(0, 512), { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Generate embeddings for an array of texts (sequential to avoid OOM).
 * @param {string[]} texts - Array of text chunks
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
async function generateEmbeddings(texts) {
  const embeddings = [];
  for (let i = 0; i < texts.length; i++) {
    if (i % 10 === 0) console.log(`  Embedding chunk ${i + 1}/${texts.length}...`);
    embeddings.push(await generateEmbedding(texts[i]));
  }
  return embeddings;
}

module.exports = { generateEmbedding, generateEmbeddings };
