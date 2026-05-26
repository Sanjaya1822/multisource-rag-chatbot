import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus, PanelLeftClose, Database, MessageSquare } from 'lucide-react';
import { useSources } from '../context/SourceContext';

/**
 * Left sidebar with chat history and source count.
 */
export default function Sidebar({ onClose }) {
  const { sources } = useSources();
  const [chats] = useState([
    { id: 1, title: 'Current conversation', active: true, time: 'now' },
  ]);

  return (
    <div className="flex flex-col h-full bg-gray-900/40 backdrop-blur-sm border-r border-white/5" style={{ width: 272 }}>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-100 text-sm leading-none">MultiSource AI</p>
            <p className="text-xs text-gray-600 mt-0.5">RAG Chatbot</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all"
          title="Close sidebar"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      {/* New Chat button */}
      <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200 text-sm font-medium">
          <Plus size={15} />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest px-2 pb-2">Recent</p>

        {chats.map((chat) => (
          <motion.button
            key={chat.id}
            whileHover={{ x: 2 }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2.5 ${
              chat.active
                ? 'bg-blue-600/15 text-blue-300 border border-blue-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <MessageSquare size={14} className="flex-shrink-0 opacity-60" />
            <span className="truncate flex-1">{chat.title}</span>
            <span className="text-xs text-gray-600 flex-shrink-0">{chat.time}</span>
          </motion.button>
        ))}
      </div>

      {/* Footer: source count */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/3">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Database size={11} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">
              {sources.length} source{sources.length !== 1 ? 's' : ''} indexed
            </p>
            <p className="text-xs text-gray-700">Ready to answer questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
