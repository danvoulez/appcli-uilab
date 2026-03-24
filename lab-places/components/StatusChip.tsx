'use client';

import { StatusLevel } from '@/types/place';

interface Props {
  status: StatusLevel;
}

const config: Record<StatusLevel, { label: string; classes: string }> = {
  healthy: { label: 'Healthy', classes: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  warning: { label: 'Warning', classes: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  degraded: { label: 'Degraded', classes: 'bg-red-500/20 text-red-300 border border-red-500/30' },
  syncing: { label: 'Syncing', classes: 'bg-sky-500/20 text-sky-300 border border-sky-500/30' },
  attention: { label: 'Attention', classes: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
};

export function StatusChip({ status }: Props) {
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${classes}`}>
      {label}
    </span>
  );
}
