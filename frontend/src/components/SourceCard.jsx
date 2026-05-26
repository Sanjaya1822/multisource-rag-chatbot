import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Globe, PlayCircle, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';

const TYPE_CONFIG = {
  pdf:     { icon: FileText, color: 'text-red-400',  bg: 'bg-red-500/10',  label: 'PDF'     },
  website: { icon: Globe,    color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Website' },
  youtube: { icon: PlayCircle,  color: 'text-red-500',  bg: 'bg-red-500/10',  label: 'YouTube' },
};

/**
 * Card displaying a single indexed knowledge source with delete functionality.
 * Requires a double-click confirmation before deleting.
 */
export default function SourceCard({ source, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cfg = TYPE_CONFIG[source.type] || TYPE_CONFIG.pdf;
  const Icon = cfg.icon;

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      // Auto-cancel after 3 seconds
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(source.id);
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const dateStr = new Date(source.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: deleting ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className="glass-card p-3 group"
    >
      <div className="flex items-start gap-2.5">
        {/* Type icon */}
        <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon size={14} className={cfg.color} />
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm text-gray-200 font-medium truncate leading-tight"
            title={source.name}
          >
            {source.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
            <span className="text-gray-800">·</span>
            <span className="text-xs text-gray-600">{source.chunkCount} chunks</span>
            <span className="text-gray-800">·</span>
            <span className="text-xs text-gray-600">{dateStr}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-700 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Open source URL"
            >
              <ExternalLink size={11} />
            </a>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              confirming
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'text-gray-700 hover:text-red-400 hover:bg-red-500/10'
            }`}
            title={confirming ? 'Click again to confirm deletion' : 'Delete source'}
          >
            {confirming ? <AlertTriangle size={11} /> : <Trash2 size={11} />}
          </button>
        </div>
      </div>

      {/* Confirmation message */}
      {confirming && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 flex items-center justify-between overflow-hidden"
        >
          <p className="text-xs text-red-400">Delete this source permanently?</p>
          <button
            onClick={() => setConfirming(false)}
            className="text-xs text-gray-600 hover:text-gray-300 ml-2"
          >
            Cancel
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
