'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import type { PlaceSummary, PlaceDetail } from '@/lib/types';
import { PlaceCardFront } from './PlaceCardFront';
import { PlaceCardBack } from './PlaceCardBack';

interface Props {
  summary: PlaceSummary;
  detail: PlaceDetail;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Premium spring configs — no bounce
const LAYOUT_SPRING = { type: 'spring', stiffness: 400, damping: 38, mass: 0.7  } as const;
const FLIP_SPRING   = { type: 'spring', stiffness: 450, damping: 34, mass: 0.55 } as const;

export function PlaceCard({ summary, detail, isOpen, onOpen, onClose }: Props) {
  // `flipped` — is the back face currently showing (or animating to show)?
  const [flipped, setFlipped] = useState(false);

  // Mouse parallax — only on idle grid card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX  = useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]);
  const tiltY  = useTransform(mouseX, [-0.5, 0.5], [-2.5, 2.5]);

  // ── Open ──────────────────────────────────────────────────────────────────
  // Flip + expand happen simultaneously
  function handleOpen() {
    if (isOpen) return;
    navigator.vibrate?.(8);
    setFlipped(true);
    onOpen();
  }

  // ── Close ─────────────────────────────────────────────────────────────────
  // Flip-back + collapse happen simultaneously
  function handleCloseRequest() {
    if (!isOpen) return;
    navigator.vibrate?.(6);
    setFlipped(false);
    onClose();
  }

  const gridVisible = !isOpen;

  return (
    <>
      {/* ── Grid slot ──────────────────────────────────────────────────── */}
      <motion.div
        layoutId={`card-${summary.id}`}
        layout="position"
        transition={LAYOUT_SPRING}
        className="relative aspect-square rounded-[20px] overflow-hidden cursor-pointer outline-none"
        style={{
          opacity: gridVisible ? 1 : 0,
          pointerEvents: gridVisible ? 'auto' : 'none',
        }}
        onClick={gridVisible ? handleOpen : undefined}
        onMouseMove={(e) => {
          if (!gridVisible) return;
          const r = e.currentTarget.getBoundingClientRect();
          mouseX.set((e.clientX - r.left) / r.width  - 0.5);
          mouseY.set((e.clientY - r.top)  / r.height - 0.5);
        }}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        whileHover={gridVisible ? { scale: 1.015, transition: { duration: 0.18 } } : {}}
        whileTap={gridVisible   ? { scale: 0.975, transition: { duration: 0.09 } } : {}}
        tabIndex={gridVisible ? 0 : -1}
        role="button"
        aria-label={`Open ${summary.title}`}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && gridVisible) {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        {/* Parallax tilt wrapper — only active in grid */}
        <motion.div
          className="w-full h-full"
          style={gridVisible ? { rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' } : {}}
        >
          <PlaceCardFront summary={summary} />
        </motion.div>
      </motion.div>

      {/* ── Expanded overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dim backdrop */}
            <motion.div
              key={`bd-${summary.id}`}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={handleCloseRequest}
              aria-hidden="true"
            />

            {/* Centering shell — pointer-events:none so clicking backdrop works */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
              {/* THE FLIP target — same layoutId as the grid card */}
              <motion.div
                layoutId={`card-${summary.id}`}
                layout="position"
                transition={LAYOUT_SPRING}
                className="relative pointer-events-auto rounded-[20px] overflow-hidden"
                style={{ width: 'min(520px, 92vw)', height: 'min(680px, 88vh)' }}
              >
                {/* 3D flip container */}
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={FLIP_SPRING}
                >
                  {/* Front face */}
                  <div
                    className="absolute inset-0 rounded-[20px] overflow-hidden"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <PlaceCardFront summary={summary} />
                  </div>

                  {/* Back face — rotated 180° so it shows when parent is at 180° */}
                  <div
                    className="absolute inset-0 rounded-[20px] overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <PlaceCardBack
                      summary={summary}
                      detail={detail}
                      onClose={handleCloseRequest}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
