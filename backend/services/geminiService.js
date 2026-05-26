const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

function getModel() {
  return getClient().getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  });
}

/**
 * Generate a streaming response from Gemini.
 * Yields text chunks as they arrive.
 * @param {string} prompt - Complete prompt with RAG context
 * @returns {AsyncGenerator<string>}
 */
async function* streamAnswer(prompt) {
  const model = getModel();
  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

/**
 * Generate a complete (non-streaming) response.
 * @param {string} prompt - Complete prompt
 * @returns {Promise<string>}
 */
async function generateAnswer(prompt) {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { streamAnswer, generateAnswer };
