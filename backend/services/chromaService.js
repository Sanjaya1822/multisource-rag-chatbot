const { ChromaClient } = require('chromadb');

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const COLLECTION_NAME = process.env.CHROMA_COLLECTION || 'rag_collection';

let client = null;
let collection = null;

/**
 * Initialize ChromaDB client and get/create the collection.
 * @returns {Promise<Collection>} ChromaDB collection
 */
async function getCollection() {
  if (collection) return collection;
  client = new ChromaClient({ path: CHROMA_URL });
  collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { 'hnsw:space': 'cosine' },
  });
  console.log(`✅ ChromaDB collection ready: ${COLLECTION_NAME}`);
  return collection;
}

/**
 * Add document chunks with their embeddings to ChromaDB.
 * @param {string} sourceId - Unique identifier for the source
 * @param {string[]} chunks - Text chunks
 * @param {number[][]} embeddings - Corresponding embedding vectors
 * @param {Object} metadata - Source metadata (name, type, url)
 */
async function addDocuments(sourceId, chunks, embeddings, metadata) {
  const col = await getCollection();
  const ids = chunks.map((_, i) => `${sourceId}_chunk_${i}`);
  const metadatas = chunks.map((_, i) => ({
    sourceId,
    chunkIndex: i,
    name: metadata.name || sourceId,
    type: metadata.type || 'unknown',
    url: metadata.url || '',
  }));

  await col.upsert({ ids, embeddings, documents: chunks, metadatas });
  console.log(`✅ Stored ${chunks.length} chunks for source: ${metadata.name || sourceId}`);
}

/**
 * Query ChromaDB for the most relevant chunks.
 * @param {number[]} queryEmbedding - Embedding of the user's question
 * @param {number} topK - Number of results to return
 * @returns {Promise<Object>} ChromaDB query results
 */
async function queryDocuments(queryEmbedding, topK = 5) {
  const col = await getCollection();
  return col.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    include: ['documents', 'metadatas', 'distances'],
  });
}

/**
 * Delete all chunks belonging to a source.
 * @param {string} sourceId - Source ID to delete
 */
async function deleteSourceChunks(sourceId) {
  const col = await getCollection();
  try {
    const results = await col.get({ where: { sourceId }, include: ['documents'] });
    if (results.ids && results.ids.length > 0) {
      await col.delete({ ids: results.ids });
      console.log(`✅ Deleted ${results.ids.length} chunks for source: ${sourceId}`);
    }
  } catch (err) {
    console.warn(`⚠️  Could not delete chunks for ${sourceId}:`, err.message);
  }
}

/**
 * Get total number of documents stored in ChromaDB.
 * @returns {Promise<number>} Document count
 */
async function getDocumentCount() {
  const col = await getCollection();
  return col.count();
}

module.exports = { addDocuments, queryDocuments, deleteSourceChunks, getDocumentCount };
