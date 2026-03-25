'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ActionItem } from '@/lib/types';

interface Props {
  actions: ActionItem[];
  title?: string;
  /** 1, 2, or 'responsive' (1-col on mobile, 2-col on desktop) */
  columns?: 1 | 2 | 'responsive';
  /** When provided, tints the primary-variant button with the place accent color */
  accentColor?: string;
}

export function ActionRail({ actions, title = 'Actions', columns = 2, accentColor }: Props) {
  const gridCls = {
    1:           'grid-cols-1',
    2:           'grid-cols-2',
    responsive:  'grid-cols-1 md:grid-cols-2',
  }[columns];

  const variantCls = {
    primary:   'bg-white/10 hover:bg-white/16 border-white/20 text-white font-semibold',
    secondary: 'bg-white/5 hover:bg-white/9 border-white/8 text-white/65 hover:text-white',
    danger:    'bg-red-500/10 hover:bg-red-500/18 border-red-500/25 text-red-300',
    ghost:     'hover:bg-white/5 border-transparent text-white/40 hover:text-white/70',
  };

  return (
    <div>
      {title && (
        <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">{title}</p>
      )}
      <div className={`grid gap-1.5 ${gridCls}`}>
        {actions.map((action) => {
          // Primary action with accentColor gets a place-tinted background
          const isPrimaryAccent = action.variant === 'primary' && !!accentColor;
          const baseCls = `flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs border transition-all duration-150 ${variantCls[action.variant ?? 'secondary']}`;
          const accentStyle = isPrimaryAccent
            ? {
                background: `linear-gradient(135deg, ${accentColor}4a 0%, ${accentColor}28 100%)`,
                borderColor: `${accentColor}50`,
              }
            : undefined;

          if (action.href) {
            return (
              <Link key={action.id} href={action.href} className={baseCls} style={accentStyle}>
                <span>{action.label}</span>
                <ArrowRight size={11} className="opacity-50 flex-shrink-0" />
              </Link>
            );
          }
          return (
            <button key={action.id} className={baseCls} style={accentStyle} disabled={action.disabled}>
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
