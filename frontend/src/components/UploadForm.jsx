import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Globe, PlayCircle, Upload, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { uploadPdf, uploadWebsite, uploadYoutube } from '../services/api';
import { useSources } from '../context/SourceContext';

const SOURCE_TABS = [
  { id: 'pdf', icon: FileText, label: 'PDF', iconColor: 'text-red-400' },
  { id: 'website', icon: Globe, label: 'Website', iconColor: 'text-blue-400' },
  { id: 'youtube', icon: PlayCircle, label: 'YouTube', iconColor: 'text-red-500' },
];

function AlertBanner({ type, message, onClose }) {
  if (!message) return null;
  const isOk = type === 'success';
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex items-start gap-2 p-3 rounded-xl text-xs mb-4 ${
        isOk
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          : 'bg-red-500/10 border border-red-500/20 text-red-400'
      }`}
    >
      {isOk
        ? <CheckCircle size={13} className="flex-shrink-0 mt-0.5" />
        : <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
      }
      <span className="flex-1 leading-relaxed">{message}</span>
      <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
        <X size={12} />
      </button>
    </motion.div>
  );
}

/**
 * Upload form with three tabs for ingesting PDFs, websites, and YouTube videos.
 * Shows progress bar for PDF uploads and spinner for processing.
 */
export default function UploadForm() {
  const [activeType, setActiveType] = useState('pdf');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', message }
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const { addSource } = useSources();

  const showAlert = (type, message) => setAlert({ type, message });
  const clearAlert = () => setAlert(null);

  // ── PDF ──────────────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      return showAlert('error', 'Please select a valid PDF file (.pdf)');
    }
    setLoading(true);
    setProgress(0);
    clearAlert();
    try {
      const result = await uploadPdf(file, setProgress);
      addSource(result.source);
      showAlert('success', result.message);
    } catch (err) {
      showAlert('error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ── URL (Website or YouTube) ─────────────────────────────────────────
  const handleUrlSubmit = async () => {
    if (!url.trim()) return showAlert('error', 'Please enter a URL.');
    setLoading(true);
    clearAlert();
    try {
      const result = activeType === 'website'
        ? await uploadWebsite(url.trim())
        : await uploadYoutube(url.trim());
      addSource(result.source);
      showAlert('success', result.message);
      setUrl('');
    } catch (err) {
      showAlert('error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Type selector tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-4">
        {SOURCE_TABS.map(({ id, icon: Icon, label, iconColor }) => (
          <button
            key={id}
            onClick={() => { setActiveType(id); clearAlert(); setUrl(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeType === id
                ? 'bg-white/10 text-white'
                : 'text-gray-600 hover:text-gray-300'
            }`}
          >
            <Icon size={12} className={activeType === id ? iconColor : ''} />
            {label}
          </button>
        ))}
      </div>

      {/* Alert banner */}
      <AnimatePresence>
        {alert && (
          <AlertBanner type={alert.type} message={alert.message} onClose={clearAlert} />
        )}
      </AnimatePresence>

      {/* Content per tab */}
      <AnimatePresence mode="wait">

        {/* ── PDF drop zone ── */}
        {activeType === 'pdf' && (
          <motion.div key="pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !loading && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                dragOver
                  ? 'border-blue-500 bg-blue-500/8 scale-[1.01]'
                  : loading
                  ? 'border-white/10 opacity-60 cursor-not-allowed'
                  : 'border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={28} className="text-blue-400 animate-spin" />
                  <p className="text-sm text-gray-400">
                    {progress > 0 ? `Uploading... ${progress}%` : 'Generating embeddings...'}
                  </p>
                  <p className="text-xs text-gray-600">This may take 30–120 seconds</p>
                </div>
              ) : (
                <>
                  <Upload size={28} className={`mx-auto mb-3 ${dragOver ? 'text-blue-400' : 'text-gray-700'}`} />
                  <p className="text-sm text-gray-400 mb-1">Drop PDF here or click to browse</p>
                  <p className="text-xs text-gray-700">Max 50 MB · PDF files only</p>
                </>
              )}
            </div>

            {/* Upload progress bar */}
            {loading && progress > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Uploading PDF</span><span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Website / YouTube URL input ── */}
        {activeType !== 'pdf' && (
          <motion.div key={activeType} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleUrlSubmit()}
                placeholder={
                  activeType === 'website'
                    ? 'https://example.com/article'
                    : 'https://youtube.com/watch?v=VIDEO_ID'
                }
                className="input-field"
                disabled={loading}
              />

              <button
                onClick={handleUrlSubmit}
                disabled={loading || !url.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing... (may take 30s)
                  </>
                ) : (
                  <>
                    {activeType === 'website'
                      ? <><Globe size={14} /> Ingest Website</>
                      : <><PlayCircle size={14} /> Ingest YouTube</>
                    }
                  </>
                )}
              </button>

              <p className="text-xs text-gray-700 text-center leading-relaxed">
                {activeType === 'youtube'
                  ? '⚠️ Video must have captions enabled'
                  : 'Public pages only · JavaScript-heavy sites may not work'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
