'use client';

import { PlaceCard } from './PlaceCard';
import type { PlaceSummary } from '@/lib/types';

interface Props {
  summaries: PlaceSummary[];
}

export function PlaceGrid({ summaries }: Props) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full"
      role="list"
      aria-label="LAB Places"
    >
      {summaries.map((summary) => (
        <div key={summary.id} role="listitem">
          <PlaceCard summary={summary} />
        </div>
      ))}
    </div>
  );
}
