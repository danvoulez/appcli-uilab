import { notFound } from 'next/navigation';
import { mockLogViews, mockInspectors } from '@/lib/mocks';
import type { JobInspector } from '@/lib/types';
import { OperatorShell } from '@/components/shell/OperatorShell';
import { StatusChip } from '@/components/StatusChip';
import { LogView } from '@/components/log-view/LogView';

interface Props { params: Promise<{ id: string }>; }

export default async function JobLogViewPage({ params }: Props) {
  const { id } = await params;
  const logView = mockLogViews.find((l) => l.sourceType === 'job' && l.sourceId === id);
  if (!logView) notFound();

  const inspector = mockInspectors.find(
    (i) => i.type === 'job' && i.id === id
  ) as JobInspector | undefined;

  return (
    <OperatorShell
      title={`Logs — ${logView.sourceLabel}`}
      descriptor="Job Log View"
      breadcrumbs={[
        { label: 'LAB 512', href: '/places/lab-512' },
        { label: logView.sourceLabel, href: `/inspectors/jobs/${id}` },
        { label: 'Logs' },
      ]}
      badge={inspector ? <StatusChip status={inspector.status} /> : undefined}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <p className="text-xs text-white/35 font-medium">
            {logView.entries.length} entries
            {logView.hasMore ? ' (truncated)' : ''}
          </p>
          <span className="text-[10px] text-white/20 font-mono uppercase">source: {logView.sourceLabel}</span>
        </div>
        <LogView logView={logView} />
      </div>
    </OperatorShell>
  );
}
