const dots = [0, 1, 2];

function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center gap-6">
        <div className="text-xs uppercase tracking-[0.5em] text-white/50">
          Dawit Worku
        </div>
        <div className="flex items-center gap-2">
          {dots.map((dot) => (
            <span
              key={dot}
              className="h-3 w-3 rounded-full bg-white"
              style={{
                animation: "loaderPulse 1.2s ease-in-out infinite",
                animationDelay: `${dot * 0.15}s`,
              }}
            />
          ))}
        </div>
        <p className="text-sm text-white/60">Loading portfolio…</p>
      </div>
    </div>
  );
}

export default Loading;
