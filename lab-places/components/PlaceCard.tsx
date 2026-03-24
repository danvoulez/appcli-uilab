'use client';

import { useState, useRef } from 'react';
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
  // `flipped`  — is the back face currently showing (or animating to show)?
  // `closing`  — are we mid-close? (flip-back is playing; overlay still visible)
  const [flipped, setFlipped] = useState(false);
  const [closing, setClosing] = useState(false);

  // Mouse parallax — only on idle grid card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX  = useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]);
  const tiltY  = useTransform(mouseX, [-0.5, 0.5], [-2.5, 2.5]);

  // ── Open ──────────────────────────────────────────────────────────────────
  function handleOpen() {
    if (isOpen || closing) return;
    navigator.vibrate?.(8);
    onOpen(); // parent sets isOpen=true → overlay enters AnimatePresence
    // Flip to back is triggered by onLayoutAnimationComplete (see below)
  }

  // Called when the FLIP expansion layout animation settles
  function handleExpandSettled() {
    // Only flip if we're opening (not in a closing sequence)
    if (isOpen && !closing && !flipped) {
      setFlipped(true);
    }
  }

  // ── Close ─────────────────────────────────────────────────────────────────
  // Step 1: user asks to close → flip card back to front
  function handleCloseRequest() {
    if (!flipped || closing) return;
    navigator.vibrate?.(6);
    setClosing(true);
    setFlipped(false);
  }

  // Step 2: flip-back animation finishes → now collapse the overlay back to grid
  function handleFlipBackComplete() {
    if (closing && !flipped) {
      // Flip-back done. Removing from AnimatePresence triggers the layout
      // animation back to the grid slot (Framer Motion layoutId handles this).
      setClosing(false);
      onClose(); // parent sets isOpen=false
    }
  }

  // The overlay is visible while open OR while the flip-back is playing
  const overlayVisible = isOpen || closing;
  // Grid card is hidden while any overlay activity is happening
  const gridVisible    = !isOpen && !closing;

  return (
    <>
      {/* ── Grid slot ──────────────────────────────────────────────────── */}
      {/* Always in DOM so layoutId has a source/target to animate to/from */}
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
        {overlayVisible && (
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

            {/*
              Centering shell — this is NOT the layoutId element.
              pointer-events:none so clicking the backdrop works.
            */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
              {/*
                THE FLIP target — same layoutId as the grid card.
                Framer Motion animates the card from its grid position to here.
                This element must be the same visual size as the final card.
              */}
              <motion.div
                layoutId={`card-${summary.id}`}
                layout="position"
                transition={LAYOUT_SPRING}
                className="relative pointer-events-auto rounded-[20px] overflow-hidden"
                style={{ width: 'min(520px, 92vw)', height: 'min(680px, 88vh)' }}
                onLayoutAnimationComplete={handleExpandSettled}
              >
                {/*
                  3D flip container.
                  perspective must be on the PARENT, so we set it here via style.
                  transformStyle preserve-3d on this element.
                */}
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={FLIP_SPRING}
                  onAnimationComplete={(latest) => {
                    // Only act on the rotateY animation settling
                    if (typeof latest === 'object' && 'rotateY' in latest) {
                      const ry = (latest as { rotateY: number }).rotateY;
                      // rotateY 0 → flip-back complete (if we were closing)
                      if (Math.abs(ry) < 1) handleFlipBackComplete();
                    }
                  }}
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
                    {/* Mount back content only while it could be visible */}
                    {(flipped || closing) && (
                      <PlaceCardBack
                        summary={summary}
                        detail={detail}
                        onClose={handleCloseRequest}
                      />
                    )}
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
