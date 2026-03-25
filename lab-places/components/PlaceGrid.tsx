'use client';

import { PlaceCard } from './PlaceCard';
import { mockPlaceSummaries } from '@/lib/mocks';

export function PlaceGrid() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full"
      role="list"
      aria-label="LAB Places"
    >
      {mockPlaceSummaries.map((summary) => (
        <div key={summary.id} role="listitem">
          <PlaceCard summary={summary} />
        </div>
      ))}
    </div>
  );
}
