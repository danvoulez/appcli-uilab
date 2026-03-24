'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { PlaceData, ActionItem } from '@/types/place';
import { StatusLights } from './StatusLights';
import { StatusChip } from './StatusChip';

interface Props {
  place: PlaceData;
  onClose: () => void;
}

const itemStatusColor = {
  ok: 'text-emerald-400',
  warn: 'text-amber-400',
  error: 'text-red-400',
  idle: 'text-white/30',
};

const itemStatusDot = {
  ok: 'bg-emerald-400',
  warn: 'bg-amber-400',
  error: 'bg-red-400',
  idle: 'bg-white/20',
};

const actionVariant = {
  primary: 'bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold',
  secondary: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white',
  danger: 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300',
};

const tabs = ['State', 'Operations', 'Details'] as const;
type Tab = typeof tabs[number];

function ActionButton({ action }: { action: ActionItem }) {
  const variant = action.variant ?? 'secondary';
  return (
    <button
      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${actionVariant[variant]}`}
    >
      {action.label}
    </button>
  );
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all"
      >
        {title}
        {open ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}

export function PlaceCardBack({ place, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('State');

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <div
      className="relative w-full h-full rounded-[20px] overflow-hidden flex flex-col"
      style={{ background: `linear-gradient(135deg, ${place.accentColor}22 0%, #0f0f0f 60%)`, backgroundColor: '#141414' }}
    >
      {/* Subtle inner border */}
      <div className="absolute inset-0 rounded-[20px] border border-white/8 pointer-events-none" />

      {/* Header */}
      <div className="flex-shrink-0 flex items-start justify-between p-5 pb-3 border-b border-white/8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-white tracking-tight">{place.title}</h2>
            <StatusChip status={place.status} />
          </div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{place.descriptor}</p>
          <StatusLights lights={place.statusLights} />
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 border border-white/10 transition-all duration-150 text-white/60 hover:text-white flex-shrink-0 ml-2"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex gap-1 px-5 pt-3 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              activeTab === tab
                ? 'bg-white/12 text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-none">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* ---- STATE TAB ---- */}
          {activeTab === 'State' && (
            <>
              {/* Overview */}
              <motion.div variants={itemVariants}>
                <p className="text-sm text-white/70 leading-relaxed">{place.overview}</p>
              </motion.div>

              {/* Attention block */}
              {place.attention && (
                <motion.div
                  variants={itemVariants}
                  className="flex gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25"
                >
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                      {place.attention.title}
                    </p>
                    <p className="text-xs text-amber-200/70 leading-relaxed">{place.attention.body}</p>
                  </div>
                </motion.div>
              )}

              {/* Primary signals */}
              <motion.div variants={itemVariants}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
                  Key Signals
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {place.primarySignals.map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-white/8">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{s.label}</p>
                      <p className="text-sm font-bold text-white">{s.value}</p>
                      {s.note && <p className="text-[10px] text-white/35 mt-0.5">{s.note}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Status lights detail */}
              <motion.div variants={itemVariants}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
                  Readiness
                </p>
                <div className="flex flex-col gap-1.5">
                  {place.statusLights.map((l) => (
                    <div key={l.label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-xs text-white/60">{l.label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          l.status === 'on' ? 'bg-emerald-400' : l.status === 'warn' ? 'bg-amber-400' : 'bg-white/20'
                        }`} />
                        <span className={`text-xs font-semibold ${
                          l.status === 'on' ? 'text-emerald-400' : l.status === 'warn' ? 'text-amber-400' : 'text-white/30'
                        }`}>
                          {l.status === 'on' ? 'Online' : l.status === 'warn' ? 'Warning' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* ---- OPERATIONS TAB ---- */}
          {activeTab === 'Operations' && (
            <>
              {/* Panels */}
              {place.panels.map((panel) => (
                <motion.div key={panel.title} variants={itemVariants}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
                    {panel.title}
                  </p>
                  <div className="rounded-xl border border-white/8 overflow-hidden">
                    {panel.items.map((item, i) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between px-3.5 py-2.5 ${
                          i < panel.items.length - 1 ? 'border-b border-white/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.status && (
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${itemStatusDot[item.status]}`} />
                          )}
                          <span className="text-xs text-white/70 truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          {item.note && <span className="text-[10px] text-white/30">{item.note}</span>}
                          {item.value && (
                            <span className={`text-xs font-semibold ${item.status ? itemStatusColor[item.status] : 'text-white/70'}`}>
                              {item.value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Actions */}
              <motion.div variants={itemVariants}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
                  Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {place.actions.map((action) => (
                    <ActionButton key={action.label} action={action} />
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* ---- DETAILS TAB ---- */}
          {activeTab === 'Details' && (
            <>
              {place.deepDetails.map((section) => (
                <motion.div key={section.title} variants={itemVariants}>
                  <Accordion title={section.title} defaultOpen={place.deepDetails.indexOf(section) === 0}>
                    <div className="space-y-0">
                      {section.rows.map((row, i) => (
                        <div
                          key={row.label}
                          className={`flex items-start justify-between py-2 ${
                            i < section.rows.length - 1 ? 'border-b border-white/5' : ''
                          }`}
                        >
                          <span className="text-xs text-white/45 flex-shrink-0 w-2/5">{row.label}</span>
                          <div className="text-right">
                            <span className="text-xs font-semibold text-white/80">{row.value}</span>
                            {row.note && (
                              <p className="text-[10px] text-white/35 mt-0.5">{row.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                </motion.div>
              ))}

              {/* Relations */}
              <motion.div variants={itemVariants}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
                  Relations
                </p>
                <div className="space-y-1.5">
                  {place.relations.map((rel) => (
                    <div
                      key={rel.place}
                      className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/4 border border-white/8"
                    >
                      <span className="text-xs font-semibold text-white/70">{rel.place}</span>
                      <span className="text-[10px] text-white/35 italic">{rel.nature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
