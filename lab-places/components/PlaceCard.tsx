'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { PlaceData } from '@/types/place';
import { PlaceCardFront } from './PlaceCardFront';
import { PlaceCardBack } from './PlaceCardBack';

interface Props {
  place: PlaceData;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
  index: number;
}

// Premium spring configs
const openSpring = { type: 'spring', stiffness: 340, damping: 34, mass: 0.9 } as const;
const closeSpring = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 } as const;
const flipSpring = { type: 'spring', stiffness: 260, damping: 32, mass: 0.8 } as const;

export function PlaceCard({ place, isOpen, onOpen, onClose, gridRef, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [phase, setPhase] = useState<'grid' | 'expanding' | 'flipping' | 'open' | 'closing-flip' | 'returning'>('grid');

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [isOpen, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleOpen = () => {
    if (phase !== 'grid') return;
    // Optional vibration feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
    setPhase('expanding');
    onOpen();
    // After expansion, flip
    setTimeout(() => {
      setPhase('flipping');
      setIsFlipped(true);
      setTimeout(() => setPhase('open'), 600);
    }, 400);
  };

  const handleClose = () => {
    if (phase !== 'open') return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(6);
    }
    setPhase('closing-flip');
    setIsFlipped(false);
    setTimeout(() => {
      setPhase('returning');
      onClose();
      setTimeout(() => setPhase('grid'), 500);
    }, 450);
  };

  const isActive = isOpen;
  const inGrid = phase === 'grid';

  return (
    <>
      {/* Grid placeholder — always occupies space */}
      <motion.div
        ref={cardRef}
        layoutId={`card-${place.id}`}
        className={`relative aspect-square cursor-pointer rounded-[20px] ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ perspective: 800 }}
        onClick={inGrid && !isActive ? handleOpen : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={inGrid && !isActive ? { scale: 1.015, transition: { duration: 0.2 } } : {}}
        whileTap={inGrid && !isActive ? { scale: 0.975, transition: { duration: 0.1 } } : {}}
        tabIndex={inGrid && !isActive ? 0 : -1}
        role="button"
        aria-label={`Open ${place.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (inGrid && !isActive) handleOpen();
          }
        }}
      >
        <motion.div
          className="w-full h-full"
          style={inGrid && !isActive ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
        >
          <PlaceCardFront place={place} />
        </motion.div>

        {/* Focus ring */}
        <div className="absolute inset-0 rounded-[20px] ring-2 ring-white/0 focus-within:ring-white/40 transition-all pointer-events-none" />
      </motion.div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {isActive && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Expanded card */}
            <motion.div
              key="expanded"
              layoutId={`card-${place.id}`}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
              transition={isActive ? openSpring : closeSpring}
            >
              <motion.div
                className="relative pointer-events-auto"
                style={{
                  width: 'min(520px, 92vw)',
                  height: 'min(680px, 88vh)',
                  perspective: 1200,
                }}
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.94 }}
                transition={openSpring}
              >
                {/* 3D flip container */}
                <motion.div
                  className="relative w-full h-full"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={flipSpring}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front face (during expansion) */}
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <PlaceCardFront place={place} />
                  </div>

                  {/* Back face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <PlaceCardBack place={place} onClose={handleClose} />
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
