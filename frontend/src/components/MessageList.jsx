import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

/**
 * Scrollable list of chat messages with auto-scroll and typing indicator.
 */
export default function MessageList({ messages, isStreaming }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const lastMsg = messages[messages.length - 1];
  const showTyping = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === '';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Message message={msg} />
          </motion.div>
        ))}
      </AnimatePresence>

      {showTyping && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TypingIndicator />
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
