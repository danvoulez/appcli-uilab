'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaceCard } from './PlaceCard';
import { mockPlaceSummaries, mockPlaceDetails } from '@/lib/mocks';

export function PlaceGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore from URL
  useEffect(() => {
    const placeParam = searchParams.get('place');
    if (placeParam && mockPlaceSummaries.find((p) => p.id === placeParam)) {
      setOpenId(placeParam);
    }
  }, [searchParams]);

  // ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openId) handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openId]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = openId ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openId]);

  const handleOpen = useCallback((id: string) => {
    setOpenId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set('place', id);
    router.replace(`?${params}`, { scroll: false });
  }, [searchParams, router]);

  const handleClose = useCallback(() => {
    setOpenId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('place');
    params.delete('tab');
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '/', { scroll: false });
  }, [searchParams, router]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full"
      role="list"
      aria-label="LAB Places"
    >
      {mockPlaceSummaries.map((summary, index) => {
        const detail = mockPlaceDetails.find((d) => d.id === summary.id)!;
        return (
          <div key={summary.id} role="listitem">
            <PlaceCard
              summary={summary}
              detail={detail}
              isOpen={openId === summary.id}
              onOpen={() => handleOpen(summary.id)}
              onClose={handleClose}
            />
          </div>
        );
      })}
    </div>
  );
}
