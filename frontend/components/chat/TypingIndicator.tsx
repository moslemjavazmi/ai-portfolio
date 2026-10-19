export function TypingIndicator() {
  return (
    <div className="flex justify-end">
      <div className="bg-neutral-100 rounded-2xl rounded-tl-sm px-5 py-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}