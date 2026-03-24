import { notFound } from 'next/navigation';
import { mockTimelines, mockInspectors } from '@/lib/mocks';
import type { ProjectInspector } from '@/lib/types';
import { OperatorShell } from '@/components/shell/OperatorShell';
import { StatusChip } from '@/components/StatusChip';
import { TimelineView } from '@/components/timeline/TimelineView';

interface Props { params: Promise<{ id: string }>; }

export default async function ProjectTimelinePage({ params }: Props) {
  const { id } = await params;
  const timeline = mockTimelines.find((t) => t.objectType === 'project' && t.objectId === id);
  if (!timeline) notFound();

  const inspector = mockInspectors.find(
    (i) => i.type === 'project' && i.id === id
  ) as ProjectInspector | undefined;

  return (
    <OperatorShell
      title={`Timeline — ${timeline.objectLabel}`}
      descriptor="Project Timeline"
      breadcrumbs={[
        { label: 'SUPABASE', href: '/places/supabase' },
        { label: timeline.objectLabel, href: `/inspectors/projects/${id}` },
        { label: 'Timeline' },
      ]}
      badge={inspector ? <StatusChip status={inspector.status} /> : undefined}
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/35 font-medium">
            {timeline.events.length} events · most recent first
          </p>
        </div>
        <TimelineView timeline={timeline} />
      </div>
    </OperatorShell>
  );
}
