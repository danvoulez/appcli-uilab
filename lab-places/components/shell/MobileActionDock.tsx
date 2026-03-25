'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ActionItem } from '@/lib/types';

interface Props {
  action: ActionItem;
  accentColor: string;
  /** Optional secondary quick actions shown as ghost pills beside the primary */
  secondaryActions?: ActionItem[];
}

/**
 * Sticky bottom dock — mobile only (md:hidden).
 * Keeps the primary place action always reachable while the user scrolls
 * through observability content.
 */
export function MobileActionDock({ action, accentColor, secondaryActions }: Props) {
  const primaryCls =
    'flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-150 active:scale-[0.98]';
  const primaryStyle = {
    background: `linear-gradient(135deg, ${accentColor}80 0%, ${accentColor}55 100%)`,
    border: `1px solid ${accentColor}60`,
  };

  const secondaryCls =
    'flex items-center justify-center gap-1.5 px-3.5 py-3.5 rounded-2xl text-xs font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-150 active:scale-[0.97]';

  const primaryContent = (
    <>
      <span>{action.label}</span>
      <ArrowRight size={14} className="opacity-75 flex-shrink-0" />
    </>
  );

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-4 pb-7 pt-4"
      style={{
        background: 'linear-gradient(to top, rgba(14,14,14,0.96) 55%, rgba(14,14,14,0.0))',
      }}
    >
      <div className="flex gap-2 max-w-lg mx-auto">
        {action.href ? (
          <Link href={action.href} className={primaryCls} style={primaryStyle}>
            {primaryContent}
          </Link>
        ) : (
          <button className={primaryCls} style={primaryStyle} disabled={action.disabled}>
            {primaryContent}
          </button>
        )}

        {secondaryActions?.slice(0, 2).map((sec) =>
          sec.href ? (
            <Link key={sec.id} href={sec.href} className={secondaryCls}>
              {sec.label}
            </Link>
          ) : (
            <button key={sec.id} className={secondaryCls} disabled={sec.disabled}>
              {sec.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
