import { useState, useCallback } from 'react';
import { chatStream } from '../services/api';

/**
 * Hook that manages chat messages and SSE streaming from the RAG backend.
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  /**
   * Send a message to the backend and stream the RAG response token-by-token.
   * @param {string} text - User's question
   */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return;

    // 1. Add user message immediately
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 2. Add placeholder AI message (will be filled as tokens stream in)
    const aiId = Date.now() + 1;
    const aiMsg = {
      id: aiId,
      role: 'assistant',
      content: '',
      sources: [],
      timestamp: new Date(),
      streaming: true,
    };
    setMessages((prev) => [...prev, aiMsg]);

    setIsStreaming(true);

    try {
      const response = await chatStream(text);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // 3. Read SSE stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep the last incomplete line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw);

            switch (event.type) {
              case 'sources':
                // Attach source citations to the AI message
                setMessages((prev) =>
                  prev.map((m) => (m.id === aiId ? { ...m, sources: event.sources } : m))
                );
                break;

              case 'token':
                // Append token to AI message content
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiId ? { ...m, content: m.content + event.text } : m
                  )
                );
                break;

              case 'done':
                // Mark streaming as complete
                setMessages((prev) =>
                  prev.map((m) => (m.id === aiId ? { ...m, streaming: false } : m))
                );
                break;

              case 'error':
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiId
                      ? { ...m, content: `❌ Error: ${event.message}`, streaming: false, error: true }
                      : m
                  )
                );
                break;
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? { ...m, content: `❌ ${err.message}`, streaming: false, error: true }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming]);

  /** Clear all messages and reset chat */
  const clearChat = useCallback(() => {
    setMessages([]);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, sendMessage, clearChat };
}
