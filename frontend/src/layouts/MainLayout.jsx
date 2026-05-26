import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import SourcePanel from '../components/SourcePanel';
import { PanelRight, PanelLeftClose, Bot } from 'lucide-react';

/**
 * Three-column layout: Sidebar | Chat | Source Panel
 * Both side panels are collapsible with smooth Framer Motion animations.
 */
export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sourcePanelOpen, setSourcePanelOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">

      {/* ── Left Sidebar ───────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 272, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="flex-shrink-0 overflow-hidden"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 flex-shrink-0 bg-gray-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="btn-ghost p-2"
                title="Open sidebar"
              >
                <PanelLeftClose size={17} className="rotate-180" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-100 text-sm">MultiSource AI</span>
                <span className="ml-2 text-xs text-gray-600 hidden sm:inline">RAG Chatbot</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSourcePanelOpen(!sourcePanelOpen)}
            className={`btn-ghost flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              sourcePanelOpen
                ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Toggle knowledge sources panel"
          >
            <PanelRight size={15} />
            <span className="hidden sm:inline">Sources</span>
          </button>
        </header>

        {/* Page content + source panel side by side */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>

          {/* ── Right Source Panel ─────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {sourcePanelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="flex-shrink-0 overflow-hidden border-l border-white/5"
              >
                <SourcePanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
