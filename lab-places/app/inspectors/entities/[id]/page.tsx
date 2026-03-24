import { notFound } from 'next/navigation';
import { mockInspectors } from '@/lib/mocks';
import type { EntityInspector } from '@/lib/types';
import { OperatorShell } from '@/components/shell/OperatorShell';
import { StatusChip } from '@/components/StatusChip';
import { InspectorLayout } from '@/components/inspector/InspectorLayout';
import { InfoPanel } from '@/components/shell/InfoPanel';
import { ObjectPanel } from '@/components/shell/ObjectPanel';
import { ActionRail } from '@/components/shell/ActionRail';

interface Props { params: Promise<{ id: string }>; }

export default async function EntityInspectorPage({ params }: Props) {
  const { id } = await params;
  const inspector = mockInspectors.find(
    (i) => i.type === 'entity' && i.id === id
  ) as EntityInspector | undefined;
  if (!inspector) notFound();

  return (
    <OperatorShell
      title={inspector.canonicalName}
      descriptor="Entity Inspector"
      breadcrumbs={[
        { label: 'LAB ID', href: '/places/lab-id' },
        { label: 'Entities', href: '/inspectors/entities/entity-001' },
        { label: inspector.canonicalName },
      ]}
      badge={<StatusChip status={inspector.status} />}
    >
      <InspectorLayout
        inspector={inspector}
        timelineHref={`/timelines/projects/proj-001`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Role + capabilities */}
          <InfoPanel
            title="Role & Capabilities"
            rows={[
              { label: 'Role', value: inspector.role },
              ...inspector.capabilities.map((cap) => ({ label: cap, value: 'granted' })),
            ]}
          />

          {/* Credentials */}
          <ObjectPanel
            title="Credentials"
            items={inspector.credentials.map((c) => ({
              label: c.label,
              value: c.validity,
              status: c.status === 'expired' ? 'error' : c.status,
            }))}
          />

          {/* Trust links */}
          <InfoPanel
            title="Trust Links"
            rows={inspector.trustLinks.map((t) => ({
              label: t.target,
              value: t.mechanism,
            }))}
          />

          {/* Actions */}
          <ActionRail
            title="Actions"
            columns={1}
            actions={[
              { id: 'inspect-creds', label: 'Inspect credentials', variant: 'primary' },
              { id: 'rotate-key', label: 'Rotate credential', variant: 'danger' },
              { id: 'review-caps', label: 'Review capabilities', variant: 'secondary' },
              { id: 'revoke', label: 'Revoke entity', variant: 'danger' },
            ]}
          />
        </div>
      </InspectorLayout>
    </OperatorShell>
  );
}
