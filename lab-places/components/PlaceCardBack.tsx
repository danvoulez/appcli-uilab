'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { PlaceSummary, PlaceDetail, ActionItem } from '@/lib/types';
import { StatusLights } from './StatusLights';
import { StatusChip } from './StatusChip';

interface Props {
  summary: PlaceSummary;
  detail: PlaceDetail;
  onClose: () => void;
}

// ─── Sub-components ────────────────────────────────────────────────────────

const itemStatusDot: Record<string, string> = {
  ok:   'bg-emerald-400',
  warn: 'bg-amber-400',
  error:'bg-red-400',
  idle: 'bg-white/20',
};
const itemStatusText: Record<string, string> = {
  ok:   'text-emerald-400',
  warn: 'text-amber-400',
  error:'text-red-400',
  idle: 'text-white/30',
};

function ActionBtn({ action }: { action: ActionItem }) {
  const base = 'w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-between gap-2';
  const variants = {
    primary:   'bg-white/12 hover:bg-white/18 border border-white/20 text-white',
    secondary: 'bg-white/5 hover:bg-white/10 border border-white/8 text-white/65 hover:text-white',
    danger:    'bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-300',
    ghost:     'text-white/40 hover:text-white/70 hover:bg-white/5',
  };
  const cls = `${base} ${variants[action.variant ?? 'secondary']}`;

  if (action.href) {
    return (
      <Link href={action.href} className={cls}>
        <span>{action.label}</span>
        <ArrowRight size={11} className="opacity-50 flex-shrink-0" />
      </Link>
    );
  }
  return (
    <button className={cls} disabled={action.disabled}>
      <span>{action.label}</span>
    </button>
  );
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export function PlaceCardBack({ summary, detail, onClose }: Props) {
  const [showAllPanels, setShowAllPanels] = useState(false);
  const visiblePanels = showAllPanels ? detail.panels : detail.panels.slice(0, 2);

  return (
    <div
      className="relative w-full h-full rounded-[20px] overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(145deg, ${summary.accentColor}18 0%, #111111 55%)`,
        backgroundColor: '#141414',
      }}
    >
      {/* Inner border */}
      <div className="absolute inset-0 rounded-[20px] border border-white/[0.07] pointer-events-none" />

      {/* Header */}
      <div className="flex-shrink-0 flex items-start justify-between px-5 pt-5 pb-3 border-b border-white/[0.07]">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-black text-white tracking-tight leading-none">{summary.title}</h2>
            <StatusChip status={summary.status} />
          </div>
          <p className="text-[10px] text-white/35 font-semibold uppercase tracking-[0.14em]">{summary.descriptor}</p>
          <StatusLights lights={summary.statusLights} />
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex-shrink-0 ml-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/14 border border-white/10 transition-all duration-150 text-white/50 hover:text-white"
        >
          <X size={13} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-none">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">

          {/* State overview */}
          <motion.div variants={fadeUp}>
            <p className="text-sm text-white/65 leading-relaxed">{detail.overview}</p>
          </motion.div>

          {/* Attention */}
          {summary.attention && (
            <motion.div
              variants={fadeUp}
              className="flex gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/22"
            >
              <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                  {summary.attention.title}
                </p>
                <p className="text-[11px] text-amber-200/65 leading-snug">{summary.attention.body}</p>
              </div>
            </motion.div>
          )}

          {/* Panels */}
          {visiblePanels.map((panel) => (
            <motion.div key={panel.title} variants={fadeUp}>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">{panel.title}</p>
              <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                {panel.items.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-3 py-2 ${i < panel.items.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.status && (
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${itemStatusDot[item.status]}`} />
                      )}
                      <span className="text-[11px] text-white/65 truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      {item.note && <span className="text-[10px] text-white/28">{item.note}</span>}
                      {item.value && (
                        <span className={`text-[11px] font-semibold ${item.status ? itemStatusText[item.status] : 'text-white/65'}`}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {detail.panels.length > 2 && !showAllPanels && (
            <button
              onClick={() => setShowAllPanels(true)}
              className="text-[10px] text-white/35 hover:text-white/60 font-semibold uppercase tracking-wider transition-colors"
            >
              + {detail.panels.length - 2} more panels
            </button>
          )}

          {/* Actions */}
          <motion.div variants={fadeUp}>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">Actions</p>
            <div className="grid grid-cols-2 gap-1.5">
              {detail.actions.slice(0, 4).map((action) => (
                <ActionBtn key={action.id} action={action} />
              ))}
            </div>
          </motion.div>

          {/* Deep entry links */}
          <motion.div variants={fadeUp}>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">Inspect</p>
            <div className="flex flex-col gap-1">
              <Link
                href={`/places/${summary.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/4 hover:bg-white/8 border border-white/[0.07] transition-all group"
              >
                <span className="text-[11px] font-semibold text-white/65 group-hover:text-white">
                  Open full place view
                </span>
                <ExternalLink size={11} className="text-white/30 group-hover:text-white/60" />
              </Link>
              {detail.relations.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {detail.relations.slice(0, 3).map((rel) => (
                    rel.placeId ? (
                      <Link
                        key={rel.place}
                        href={`/places/${rel.placeId}`}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/4 hover:bg-white/8 border border-white/[0.06] text-[10px] text-white/40 hover:text-white/70 transition-all"
                      >
                        {rel.place}
                        <ArrowRight size={9} />
                      </Link>
                    ) : (
                      <span
                        key={rel.place}
                        className="px-2.5 py-1 rounded-lg bg-white/4 border border-white/[0.06] text-[10px] text-white/35"
                      >
                        {rel.place}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
