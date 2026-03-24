'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ActionItem } from '@/lib/types';

interface Props {
  actions: ActionItem[];
  title?: string;
  columns?: 1 | 2;
}

export function ActionRail({ actions, title = 'Actions', columns = 2 }: Props) {
  const variantCls = {
    primary:   'bg-white/10 hover:bg-white/16 border-white/20 text-white font-semibold',
    secondary: 'bg-white/5 hover:bg-white/9 border-white/8 text-white/65 hover:text-white',
    danger:    'bg-red-500/10 hover:bg-red-500/18 border-red-500/25 text-red-300',
    ghost:     'hover:bg-white/5 border-transparent text-white/40 hover:text-white/70',
  };

  return (
    <div>
      {title && (
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30 mb-2">{title}</p>
      )}
      <div className={`grid gap-1.5 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {actions.map((action) => {
          const cls = `flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs border transition-all duration-150 ${variantCls[action.variant ?? 'secondary']}`;
          if (action.href) {
            return (
              <Link key={action.id} href={action.href} className={cls}>
                <span>{action.label}</span>
                <ArrowRight size={11} className="opacity-50 flex-shrink-0" />
              </Link>
            );
          }
          return (
            <button key={action.id} className={cls} disabled={action.disabled}>
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
