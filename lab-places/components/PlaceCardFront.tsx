'use client';

import type { PlaceSummary } from '@/lib/types';
import { StatusLights } from './StatusLights';

interface Props {
  summary: PlaceSummary;
}

const statusDotColor: Record<string, string> = {
  healthy:   'bg-emerald-400',
  warning:   'bg-amber-400',
  degraded:  'bg-red-400',
  syncing:   'bg-sky-400',
  attention: 'bg-orange-400',
  offline:   'bg-white/30',
};

export function PlaceCardFront({ summary }: Props) {
  return (
    <div
      className="relative w-full h-full rounded-[20px] overflow-hidden select-none"
      style={{ backgroundColor: summary.accentColor }}
    >
      {/* Subtle noise / depth gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 rounded-[20px]" />

      {/* Inner highlight on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3.5 md:p-4">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${statusDotColor[summary.status]}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/65">
              {summary.descriptor}
            </span>
          </div>
          <StatusLights lights={summary.statusLights} compact />
        </div>

        {/* Bottom */}
        <div className="space-y-2.5">
          {/* Signals */}
          {summary.primarySignals.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {summary.primarySignals.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1">
                  <span className="text-[9px] text-white/45 uppercase tracking-wider">{s.label}</span>
                  <span className="text-[10px] font-bold text-white/85">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Title block */}
          <div>
            <h2 className="text-[1.7rem] md:text-[1.85rem] font-black text-white leading-none tracking-tight drop-shadow-sm">
              {summary.shortLabel}
            </h2>
            <p className="text-[10px] text-white/45 mt-1 leading-snug line-clamp-2">{summary.shortSummary}</p>
          </div>

          {/* Sparkle signature */}
          <div className="flex justify-end">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-40">
              <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
