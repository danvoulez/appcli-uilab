import { PlaceGrid } from '@/components/PlaceGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0e0e0e]">
      {/* Subtle dot-grid background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 px-4 md:px-8 pt-5 pb-4">
          <div className="flex items-baseline justify-between max-w-5xl mx-auto w-full">
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-none">LAB Places</h1>
              <p className="text-[9px] text-white/22 mt-0.5 font-semibold tracking-[0.15em] uppercase">
                Operational Cockpit
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              <span className="text-[10px] text-white/28 font-semibold tracking-wide">9 active</span>
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="flex-1 px-3 md:px-6 lg:px-8 pb-6 max-w-5xl mx-auto w-full">
          <PlaceGrid />
        </div>
      </div>
    </main>
  );
}
