'use client';

import { useReducer, useRef, useCallback } from 'react';
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

// ─── State machine ────────────────────────────────────────────────────────
// Replaces fragile setTimeout sequencing with explicit phase transitions.

type CardPhase =
  | 'idle'          // resting in grid
  | 'expanding'     // FLIP from grid → centre
  | 'flipping'      // rotateY 0→180
  | 'open'          // back face visible, fully interactive
  | 'unflipping'    // rotateY 180→0
  | 'collapsing';   // FLIP back to grid

type CardEvent =
  | { type: 'OPEN' }
  | { type: 'EXPANDED' }      // layout animation settled
  | { type: 'FLIP_DONE' }     // flip completed
  | { type: 'CLOSE' }
  | { type: 'UNFLIP_DONE' }   // unflip completed
  | { type: 'COLLAPSE_DONE' };

function reducer(phase: CardPhase, event: CardEvent): CardPhase {
  switch (phase) {
    case 'idle':       return event.type === 'OPEN' ? 'expanding' : phase;
    case 'expanding':  return event.type === 'EXPANDED' ? 'flipping' : phase;
    case 'flipping':   return event.type === 'FLIP_DONE' ? 'open' : phase;
    case 'open':       return event.type === 'CLOSE' ? 'unflipping' : phase;
    case 'unflipping': return event.type === 'UNFLIP_DONE' ? 'collapsing' : phase;
    case 'collapsing': return event.type === 'COLLAPSE_DONE' ? 'idle' : phase;
    default:           return phase;
  }
}

// ─── Spring configs ────────────────────────────────────────────────────────

const expandSpring   = { type: 'spring', stiffness: 340, damping: 34, mass: 0.9 } as const;
const collapseSpring = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 } as const;
const flipSpring     = { type: 'spring', stiffness: 260, damping: 32, mass: 0.8 } as const;

export function PlaceCard({ summary, detail, isOpen, onOpen, onClose }: Props) {
  const [phase, dispatch] = useReducer(reducer, 'idle');
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse parallax — only in idle state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'idle') return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [phase, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleOpen = useCallback(() => {
    if (phase !== 'idle') return;
    navigator.vibrate?.(8);
    dispatch({ type: 'OPEN' });
    onOpen();
  }, [phase, onOpen]);

  const handleClose = useCallback(() => {
    if (phase !== 'open') return;
    navigator.vibrate?.(6);
    dispatch({ type: 'CLOSE' });
  }, [phase]);

  // Callback when the expand layout animation settles
  const onExpandComplete = useCallback(() => {
    if (phase === 'expanding') dispatch({ type: 'EXPANDED' });
  }, [phase]);

  // Callback when the collapse layout animation settles
  const onCollapseComplete = useCallback(() => {
    if (phase === 'collapsing') {
      dispatch({ type: 'COLLAPSE_DONE' });
      onClose();
    }
  }, [phase, onClose]);

  const isActive  = isOpen;
  const isFlipped = phase === 'open' || phase === 'unflipping';
  const showBack  = phase === 'flipping' || phase === 'open' || phase === 'unflipping';

  return (
    <>
      {/* ── Grid slot ──────────────────────────────────────────────────────── */}
      <motion.div
        ref={cardRef}
        layoutId={`card-${summary.id}`}
        className={`relative aspect-square rounded-[20px] overflow-hidden cursor-pointer outline-none
          ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ perspective: 800 }}
        onClick={phase === 'idle' ? handleOpen : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={phase === 'idle' ? { scale: 1.015, transition: { duration: 0.2 } } : {}}
        whileTap={phase === 'idle' ? { scale: 0.975, transition: { duration: 0.1 } } : {}}
        tabIndex={phase === 'idle' ? 0 : -1}
        role="button"
        aria-label={`Open ${summary.title}`}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && phase === 'idle') {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        <motion.div
          className="w-full h-full"
          style={phase === 'idle' ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
        >
          <PlaceCardFront summary={summary} />
        </motion.div>
      </motion.div>

      {/* ── Expanded overlay ───────────────────────────────────────────────── */}
      <AnimatePresence onExitComplete={onCollapseComplete}>
        {isActive && (
          <>
            {/* Backdrop */}
            <motion.div
              key={`backdrop-${summary.id}`}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Card shell — uses layoutId for FLIP */}
            <motion.div
              key={`expanded-${summary.id}`}
              layoutId={`card-${summary.id}`}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
              transition={phase === 'collapsing' ? collapseSpring : expandSpring}
              onLayoutAnimationComplete={onExpandComplete}
            >
              {/* Sized wrapper */}
              <motion.div
                className="relative pointer-events-auto"
                style={{
                  width: 'min(520px, 92vw)',
                  height: 'min(680px, 88vh)',
                  perspective: 1200,
                }}
                initial={{ scale: 0.94 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.94 }}
                transition={expandSpring}
              >
                {/* 3D flip container */}
                <motion.div
                  className="relative w-full h-full"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={flipSpring}
                  style={{ transformStyle: 'preserve-3d' }}
                  onAnimationComplete={(definition) => {
                    // definition is the animate object, check via phase
                    if (phase === 'flipping')   dispatch({ type: 'FLIP_DONE' });
                    if (phase === 'unflipping') {
                      dispatch({ type: 'UNFLIP_DONE' });
                      // Trigger collapse by removing from AnimatePresence
                      onClose();
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

                  {/* Back face */}
                  <div
                    className="absolute inset-0 rounded-[20px] overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {showBack && (
                      <PlaceCardBack
                        summary={summary}
                        detail={detail}
                        onClose={handleClose}
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
