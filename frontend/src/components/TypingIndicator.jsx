/**
 * Three animated bouncing dots shown while the AI is generating a response.
 */
export default function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-4xl mx-auto w-full">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md mt-0.5">
        <span className="text-white text-xs font-bold">AI</span>
      </div>

      {/* Bubble with dots */}
      <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-gray-800/70 border border-white/5 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-2 h-2 rounded-full bg-blue-400"
              style={{
                animation: `bounce 1.2s infinite ease-in-out`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
