import { useChat } from '../hooks/useChat';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { motion } from 'framer-motion';
import { Bot, FileText, Globe, PlayCircle } from 'lucide-react';

/**
 * Main chat page.
 * Shows a welcome screen when empty, then the conversation once started.
 */
export default function ChatPage() {
  const { messages, isStreaming, sendMessage, clearChat } = useChat();

  return (
    <div className="flex flex-col h-full bg-gray-950">

      {/* ── Welcome Screen (shown when no messages) ─────────────────── */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center w-full max-w-lg"
          >
            {/* Logo */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Bot size={38} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-gray-950 animate-pulse" />
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              MultiSource AI
            </h1>
            <p className="text-gray-400 mb-1">Your RAG-powered knowledge assistant</p>
            <p className="text-gray-600 text-sm mb-8">
              Upload your sources in the panel →, then ask anything about them.
            </p>

            {/* Source type cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: FileText, label: 'PDF Documents', color: 'text-red-400', bg: 'bg-red-500/10', desc: 'Upload research papers, books, reports' },
                { icon: Globe, label: 'Websites', color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Scrape any public webpage' },
                { icon: PlayCircle, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Extract video transcripts' },
              ].map(({ icon: Icon, label, color, bg, desc }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="glass-card p-4 text-center cursor-default"
                >
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className="text-xs font-medium text-gray-300 mb-1">{label}</p>
                  <p className="text-xs text-gray-600 leading-tight">{desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Suggested prompts */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 mb-2">Try asking...</p>
              {[
                'Summarize the main topics in the uploaded document',
                'What are the key findings mentioned in the sources?',
                'Explain the concepts discussed in the video',
              ].map((prompt) => (
                <motion.button
                  key={prompt}
                  whileHover={{ x: 3 }}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 text-gray-400 hover:text-gray-200 text-sm transition-all duration-200"
                >
                  <span className="text-blue-500 mr-2">→</span>
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        /* ── Message List ──────────────────────────────────────────────── */
        <MessageList messages={messages} isStreaming={isStreaming} />
      )}

      {/* ── Chat Input (always visible) ─────────────────────────────── */}
      <div className="border-t border-white/5 px-4 py-4 bg-gray-950/80 backdrop-blur-sm flex-shrink-0">
        <ChatInput
          onSend={sendMessage}
          isStreaming={isStreaming}
          onClear={clearChat}
          hasMessages={messages.length > 0}
        />
      </div>
    </div>
  );
}
