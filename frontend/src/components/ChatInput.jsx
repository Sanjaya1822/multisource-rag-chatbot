import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, CornerDownLeft } from 'lucide-react';

/**
 * Chat input with auto-resizing textarea, send button, and keyboard shortcut.
 */
export default function ChatInput({ onSend, isStreaming, onClear, hasMessages }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 168) + 'px';
  }, [value]);

  const canSend = value.trim().length > 0 && !isStreaming;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="relative glass-card overflow-hidden">
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder={isStreaming ? 'AI is thinking...' : 'Ask anything about your uploaded sources...'}
          rows={1}
          className="w-full bg-transparent resize-none px-4 py-3.5 pr-28 text-gray-200 placeholder-gray-600 focus:outline-none text-sm leading-relaxed"
          style={{ maxHeight: '168px' }}
        />

        {/* Right action buttons */}
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {hasMessages && (
            <button
              onClick={onClear}
              className="p-2 text-gray-700 hover:text-gray-400 hover:bg-white/5 rounded-lg transition-all"
              title="Clear chat"
            >
              <Trash2 size={13} />
            </button>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!canSend}
            id="send-button"
            title="Send message (Enter)"
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              canSend
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-2">
        <p className="text-xs text-gray-700">
          <CornerDownLeft size={10} className="inline mr-1" />
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
