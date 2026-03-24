'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaceCard } from './PlaceCard';
import { places } from '@/data/places';

export function PlaceGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore open state from URL
  useEffect(() => {
    const placeParam = searchParams.get('place');
    if (placeParam && places.find((p) => p.id === placeParam)) {
      setOpenId(placeParam);
    }
  }, [searchParams]);

  // ESC key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openId) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openId]);

  // Lock body scroll when a card is open
  useEffect(() => {
    if (openId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [openId]);

  const handleOpen = useCallback((id: string) => {
    setOpenId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set('place', id);
    router.replace(`?${params.toString()}`, { scroll: false });
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
      {places.map((place, index) => (
        <div key={place.id} role="listitem">
          <PlaceCard
            place={place}
            isOpen={openId === place.id}
            onOpen={() => handleOpen(place.id)}
            onClose={handleClose}
            gridRef={gridRef}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}
