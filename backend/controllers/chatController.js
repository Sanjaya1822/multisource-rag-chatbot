const { retrieveContext, buildPrompt } = require('../services/ragService');
const { streamAnswer } = require('../services/geminiService');

/**
 * POST /api/chat
 * Streams a RAG-grounded answer via Server-Sent Events.
 */
async function chat(req, res) {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    // Retrieve relevant context from ChromaDB
    const { context, sources } = await retrieveContext(message);

    // Send source metadata before streaming the answer
    sendEvent({ type: 'sources', sources });

    // Build RAG prompt and stream Gemini response
    const prompt = buildPrompt(context, message);
    for await (const token of streamAnswer(prompt)) {
      sendEvent({ type: 'token', text: token });
    }

    sendEvent({ type: 'done' });
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    sendEvent({ type: 'error', message: err.message });
  } finally {
    res.end();
  }
}

module.exports = { chat };
