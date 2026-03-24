import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockPlaceDetails } from '@/lib/mocks';
import { OperatorShell } from '@/components/shell/OperatorShell';
import { StatusChip } from '@/components/StatusChip';
import { StatusLights } from '@/components/StatusLights';
import { ActionRail } from '@/components/shell/ActionRail';
import { InfoPanel } from '@/components/shell/InfoPanel';
import { ObjectPanel } from '@/components/shell/ObjectPanel';
import { AlertTriangle } from 'lucide-react';

interface Props {
  params: Promise<{ placeId: string }>;
}

export default async function PlacePage({ params }: Props) {
  const { placeId } = await params;
  const place = mockPlaceDetails.find((p) => p.id === placeId);
  if (!place) notFound();

  return (
    <OperatorShell
      title={place.title}
      descriptor={place.descriptor}
      breadcrumbs={[{ label: place.shortLabel }]}
      badge={<StatusChip status={place.status} />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — image + overview */}
        <div className="lg:col-span-1 space-y-5">
          {/* Card color tile */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden max-w-xs mx-auto lg:mx-0"
            style={{ backgroundColor: place.accentColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 rounded-2xl" />
            <div className="absolute bottom-4 left-4">
              <h2 className="text-2xl font-black text-white">{place.shortLabel}</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">{place.descriptor}</p>
            </div>
          </div>

          {/* Status lights */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30 mb-3">Readiness</p>
            <div className="space-y-2">
              {place.statusLights.map((l) => (
                <div key={l.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{l.label}</span>
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
          </div>

          {/* Key signals */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30 mb-3">Key Signals</p>
            <div className="space-y-2">
              {place.primarySignals.map((s) => (
                <div key={s.label} className="flex items-start justify-between">
                  <span className="text-xs text-white/45">{s.label}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white/80">{s.value}</span>
                    {s.note && <p className="text-[10px] text-white/30">{s.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relations */}
          {place.relations.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30 mb-2">Relations</p>
              <div className="space-y-1">
                {place.relations.map((rel) => (
                  <div key={rel.place} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    {rel.placeId ? (
                      <Link href={`/places/${rel.placeId}`} className="text-xs font-semibold text-white/60 hover:text-white transition-colors">
                        {rel.place}
                      </Link>
                    ) : (
                      <span className="text-xs font-semibold text-white/50">{rel.place}</span>
                    )}
                    <span className="text-[10px] text-white/30 italic">{rel.nature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — operational panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30 mb-2">Overview</p>
            <p className="text-sm text-white/65 leading-relaxed">{place.overview}</p>
          </div>

          {/* Attention */}
          {place.attention && (
            <div className="flex gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  {place.attention.title}
                </p>
                <p className="text-sm text-amber-200/65 leading-relaxed">{place.attention.body}</p>
              </div>
            </div>
          )}

          {/* Panels */}
          {place.panels.map((panel) => (
            <ObjectPanel key={panel.title} title={panel.title} items={panel.items} />
          ))}

          {/* Deep details */}
          {place.deepDetails.map((section) => (
            <InfoPanel
              key={section.title}
              title={section.title}
              rows={section.rows}
            />
          ))}

          {/* Actions */}
          <ActionRail actions={place.actions} title="Actions" columns={2} />
        </div>
      </div>
    </OperatorShell>
  );
}

export async function generateStaticParams() {
  return mockPlaceDetails.map((p) => ({ placeId: p.id }));
}
