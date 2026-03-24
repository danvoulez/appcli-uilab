'use client';

import Image from 'next/image';
import { PlaceData } from '@/types/place';
import { StatusLights } from './StatusLights';

interface Props {
  place: PlaceData;
}

// Status dot color for front face
const statusDot: Record<string, string> = {
  healthy: 'bg-emerald-400',
  warning: 'bg-amber-400',
  degraded: 'bg-red-400',
  syncing: 'bg-sky-400',
  attention: 'bg-orange-400',
};

export function PlaceCardFront({ place }: Props) {
  return (
    <div className="relative w-full h-full rounded-[20px] overflow-hidden select-none">
      {/* Background image */}
      <Image
        src={place.backgroundImage}
        alt={place.title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover"
        priority
      />

      {/* Dark vignette overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 rounded-[20px]" />

      {/* Subtle inner highlight on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10 rounded-t-[20px]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
        {/* Top row: status dot + lights */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusDot[place.status]} shadow-sm`} />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
              {place.descriptor}
            </span>
          </div>
          <StatusLights lights={place.statusLights} compact />
        </div>

        {/* Middle: title */}
        <div className="flex-1 flex items-center justify-center">
          {/* intentionally empty — title at bottom for visual weight */}
        </div>

        {/* Bottom content */}
        <div className="space-y-3">
          {/* Primary signals */}
          {place.primarySignals.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {place.primarySignals.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">{s.label}</span>
                  <span className="text-[11px] font-semibold text-white/90">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-none tracking-tight drop-shadow-sm">
              {place.shortLabel}
            </h2>
            <p className="text-[11px] text-white/55 mt-1 leading-snug">{place.shortSummary}</p>
          </div>

          {/* Footer: sparkle signature */}
          <div className="flex items-center justify-end">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
              <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
