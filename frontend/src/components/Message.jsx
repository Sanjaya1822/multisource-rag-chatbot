import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot, ChevronDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOURCE_ICONS = { pdf: '📄', website: '🌐', youtube: '🎬' };

/**
 * Individual chat message bubble for user and assistant.
 * Includes markdown rendering, source citations accordion, and copy button.
 */
export default function Message({ message }) {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className={`flex gap-3 max-w-4xl mx-auto w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 shadow-md ${
        isUser
          ? 'bg-gradient-to-br from-blue-500 to-violet-600'
          : 'bg-gradient-to-br from-emerald-500 to-teal-600'
      }`}>
        {isUser
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-white" />
        }
      </div>

      {/* Message bubble + actions */}
      <div className={`flex flex-col gap-1.5 min-w-0 ${isUser ? 'items-end max-w-[75%]' : 'items-start max-w-[82%]'}`}>

        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
            : `bg-gray-800/70 border border-white/5 text-gray-200 rounded-tl-sm ${message.streaming ? 'border-blue-500/20' : ''}`
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose-custom min-w-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const lang = /language-(\w+)/.exec(className || '')?.[1];
                    return !inline && lang ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={lang}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: '8px' }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>{children}</code>
                    );
                  },
                }}
              >
                {message.content || (message.streaming ? '▍' : '')}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action bar: copy + sources toggle */}
        {!isUser && !message.streaming && message.content && (
          <div className="flex items-center gap-3 px-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 transition-colors"
            >
              {copied
                ? <><Check size={11} className="text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                : <><Copy size={11} />Copy</>
              }
            </button>

            {message.sources?.length > 0 && (
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>{message.sources.length} source{message.sources.length > 1 ? 's' : ''} used</span>
                <ChevronDown
                  size={11}
                  className={`transition-transform duration-200 ${showSources ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        )}

        {/* Sources accordion */}
        <AnimatePresence>
          {showSources && message.sources?.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden w-full"
            >
              <div className="space-y-1.5 pt-1">
                {message.sources.map((src) => (
                  <div
                    key={src.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/3 border border-white/5 text-xs"
                  >
                    <span className="text-sm">{SOURCE_ICONS[src.type] || '📎'}</span>
                    <span className="flex-1 truncate text-gray-400 font-medium">{src.name}</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex-shrink-0"
                        title="Open source"
                      >
                        <ExternalLink size={10} />
                      </a>
                    )}
                    <span className="text-gray-700 flex-shrink-0 tabular-nums">
                      {Math.round(Number(src.similarity) * 100)}% match
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
