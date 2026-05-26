import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Database, RefreshCw } from 'lucide-react';
import UploadForm from './UploadForm';
import SourceCard from './SourceCard';
import { useSources } from '../context/SourceContext';

/**
 * Right panel with two tabs:
 * - "Upload" tab: PDF/Website/YouTube ingestion forms
 * - "Sources" tab: list of indexed knowledge bases
 */
export default function SourcePanel() {
  const [activeTab, setActiveTab] = useState('upload');
  const { sources, isLoadingSources, loadSources, removeSource } = useSources();

  // Load sources on mount
  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const tabs = [
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'sources', icon: Database, label: `Sources (${sources.length})` },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900/20" style={{ width: 340 }}>

      {/* Panel header + tabs */}
      <div className="p-4 border-b border-white/5 flex-shrink-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Knowledge Sources
        </p>
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={12} />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4"
            >
              <UploadForm />
            </motion.div>
          ) : (
            <motion.div
              key="sources"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-600">Indexed knowledge bases</p>
                <button
                  onClick={loadSources}
                  disabled={isLoadingSources}
                  className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all"
                  title="Refresh sources"
                >
                  <RefreshCw size={12} className={isLoadingSources ? 'animate-spin' : ''} />
                </button>
              </div>

              {sources.length === 0 ? (
                <div className="text-center py-12">
                  <Database size={28} className="text-gray-800 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm font-medium">No sources yet</p>
                  <p className="text-gray-700 text-xs mt-1 leading-relaxed">
                    Switch to "Upload" tab to add<br />PDFs, websites, or YouTube videos
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {sources.map((source) => (
                      <SourceCard
                        key={source.id}
                        source={source}
                        onDelete={removeSource}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
