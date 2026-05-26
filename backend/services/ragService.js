const { generateEmbedding } = require('./embeddingService');
const { queryDocuments } = require('./chromaService');

/**
 * Retrieve the most relevant context chunks for a user question.
 * @param {string} question - The user's question
 * @param {number} topK - Max number of chunks to retrieve
 * @returns {Promise<{context: string, sources: Array}>}
 */
async function retrieveContext(question, topK = 6) {
  // 1. Embed the question
  const questionEmbedding = await generateEmbedding(question);

  // 2. Semantic search in ChromaDB
  const results = await queryDocuments(questionEmbedding, topK);

  if (!results.documents || !results.documents[0] || results.documents[0].length === 0) {
    return { context: '', sources: [] };
  }

  const documents = results.documents[0];
  const metadatas = results.metadatas[0];
  const distances = results.distances[0];

  // 3. Filter by similarity threshold and build context
  const contextParts = [];
  const sourcesMap = new Map();

  documents.forEach((doc, i) => {
    const meta = metadatas[i];
    const dist = distances[i];

    // Cosine distance threshold (lower = more similar)
    if (dist < 0.85) {
      contextParts.push(`[Source: ${meta.name}]\n${doc}`);
      if (!sourcesMap.has(meta.sourceId)) {
        sourcesMap.set(meta.sourceId, {
          id: meta.sourceId,
          name: meta.name,
          type: meta.type,
          url: meta.url || null,
          similarity: (1 - dist).toFixed(3),
        });
      }
    }
  });

  return {
    context: contextParts.join('\n\n---\n\n'),
    sources: Array.from(sourcesMap.values()),
  };
}

/**
 * Build the RAG prompt with context injected.
 * @param {string} context - Retrieved context from ChromaDB
 * @param {string} question - User's question
 * @returns {string} Formatted prompt for Gemini
 */
function buildPrompt(context, question) {
  if (!context || context.trim().length === 0) {
    return `The user asked: "${question}"

No relevant context was found in the uploaded sources.
Respond with exactly: "The information was not found in the uploaded sources."`;
  }

  return `You are an AI assistant that answers questions strictly based on the provided context from uploaded documents.

CONTEXT FROM UPLOADED SOURCES:
${context}

---

USER QUESTION: ${question}

INSTRUCTIONS:
- Answer ONLY using information from the context above.
- If the answer cannot be found in the context, say exactly: "The information was not found in the uploaded sources."
- Use markdown formatting (headers, bullet points, bold text) for clarity.
- Reference source names when citing information.
- Be accurate, concise, and helpful.
- Do NOT make up or infer information beyond what the context provides.

ANSWER:`;
}

module.exports = { retrieveContext, buildPrompt };
