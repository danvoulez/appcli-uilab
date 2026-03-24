'use client';

import { StatusLight } from '@/types/place';

interface Props {
  lights: StatusLight[];
  compact?: boolean;
}

export function StatusLights({ lights, compact = false }: Props) {
  const colorMap = {
    on: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]',
    warn: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]',
    off: 'bg-white/20',
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {lights.map((l) => (
          <div
            key={l.label}
            className={`rounded-full ${colorMap[l.status]} ${compact ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
            title={l.label}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {lights.map((l) => (
        <div key={l.label} className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${colorMap[l.status]}`} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
            {l.label}
          </span>
        </div>
      ))}
    </div>
  );
}
