import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockPlaceDetails } from '@/lib/mocks';
import { OperatorShell } from '@/components/shell/OperatorShell';
import { StatusChip } from '@/components/StatusChip';
import { ActionRail } from '@/components/shell/ActionRail';
import { InfoPanel } from '@/components/shell/InfoPanel';
import { ObjectPanel } from '@/components/shell/ObjectPanel';
import { CollapsibleSection } from '@/components/shell/CollapsibleSection';
import { MobileActionDock } from '@/components/shell/MobileActionDock';
import { AlertTriangle, ArrowRight, MessageSquare } from 'lucide-react';

interface Props {
  params: Promise<{ placeId: string }>;
}

// ── Agent entry hero ────────────────────────────────────────────────────────
// Full-width CTA that makes the agent the obvious first move.
function AgentHero({
  placeId,
  shortLabel,
  accentColor,
}: {
  placeId: string;
  shortLabel: string;
  accentColor: string;
}) {
  return (
    <Link
      href={`/creation-sessions/new?desk=${placeId}`}
      className="group relative flex items-center justify-between w-full rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.99]"
      style={{
        background: [
          `radial-gradient(ellipse 80% 100% at 0% 50%, ${accentColor}cc 0%, transparent 60%)`,
          `linear-gradient(135deg, ${accentColor}aa 0%, ${accentColor}77 50%, ${accentColor}44 100%)`,
        ].join(', '),
        border: `1px solid ${accentColor}66`,
        padding: '24px 28px',
      }}
    >
      {/* Subtle top shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${accentColor}ff, ${accentColor}88, transparent)` }}
      />

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
          every action · every question
        </p>
        <p className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
          Talk to {shortLabel} agent
        </p>
      </div>

      <div className="flex-shrink-0 ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/15 group-hover:bg-white/25 border border-white/20 transition-all duration-150">
        <MessageSquare size={16} className="text-white" />
      </div>
    </Link>
  );
}

export default async function PlacePage({ params }: Props) {
  const { placeId } = await params;
  const place = mockPlaceDetails.find((p) => p.id === placeId);
  if (!place) notFound();

  const color = place.accentColor;

  // Agent action item for the persistent mobile dock
  const agentAction = {
    id: 'agent',
    label: `Talk to ${place.shortLabel} agent`,
    href: `/creation-sessions/new?desk=${placeId}`,
  };

  return (
    <>
    <OperatorShell
      title={place.title}
      descriptor={place.descriptor}
      breadcrumbs={[{ label: place.shortLabel }]}
      badge={<StatusChip status={place.status} />}
    >

      {/* ══════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on md+)
          3 things max before agent:
            1. Profile banner (color-carrying)
            2. Compact health (2-col: lights + signals)
            3. Agent hero CTA
          Then: actions + attention + collapsible inspect
          pb-32: leaves room for the persistent MobileActionDock
          ══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden space-y-4 pb-32">

        {/* 1. Profile banner — aggressive color, immediate orientation */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: [
              `radial-gradient(ellipse 110% 60% at 50% 0%, ${color}cc 0%, transparent 65%)`,
              `radial-gradient(ellipse 70% 50% at 0% 80%, ${color}66 0%, transparent 55%)`,
              `linear-gradient(165deg, ${color}99 0%, ${color}55 35%, #111111 70%)`,
              '#141414',
            ].join(', '),
            border: `1px solid ${color}55`,
            minHeight: '128px',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, ${color}ff, ${color}cc 50%, transparent)` }}
          />
          <div className="px-5 py-5 flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: `${color}ee` }}>
                {place.descriptor}
              </p>
              <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                {place.shortLabel}
              </h2>
              <p className="text-xs text-white/55 leading-snug max-w-[200px]">
                {place.shortSummary}
              </p>
            </div>
            <StatusChip status={place.status} />
          </div>
        </div>

        {/* 2. Compact health strip — lights + signals side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">Readiness</p>
            {place.statusLights.map((l) => (
              <div key={l.label} className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-white/45 truncate">{l.label}</span>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  l.status === 'on' ? 'bg-emerald-400' : l.status === 'warn' ? 'bg-amber-400' : 'bg-white/20'
                }`} />
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">Signals</p>
            {place.primarySignals.slice(0, 3).map((s) => (
              <div key={s.label} className="flex items-start justify-between gap-1">
                <span className="text-[10px] text-white/40 truncate">{s.label}</span>
                <span className="text-[10px] font-bold text-white/80 flex-shrink-0">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Agent hero — THE primary surface */}
        <AgentHero placeId={placeId} shortLabel={place.shortLabel} accentColor={color} />

        {/* Attention — if present, before actions */}
        {place.attention && (
          <div className="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                {place.attention.title}
              </p>
              <p className="text-sm text-amber-200/65 leading-relaxed">{place.attention.body}</p>
            </div>
          </div>
        )}

        {/* Quick actions — supporting the agent, not replacing it */}
        <ActionRail actions={place.actions} title="Quick Actions" columns={1} accentColor={color} />

        {/* Collapsible observe sections */}
        <CollapsibleSection title="Overview" accentColor={color}>
          <p className="text-sm text-white/58 leading-relaxed">{place.overview}</p>
        </CollapsibleSection>

        {(place.panels.length > 0 || place.deepDetails.length > 0 || place.relations.length > 0) && (
          <CollapsibleSection title="Inspect" accentColor={color}>
            <div className="space-y-4">
              {place.panels.map((panel) => (
                <div key={panel.title}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">{panel.title}</p>
                  <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                    {panel.items.map((item, i) => (
                      <div key={item.label} className={`flex items-center justify-between px-3 py-2 ${i < panel.items.length - 1 ? 'border-b border-white/[0.05]' : ''}`}>
                        <div className="flex items-center gap-2 min-w-0">
                          {item.status && (
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              item.status === 'ok' ? 'bg-emerald-400' :
                              item.status === 'warn' ? 'bg-amber-400' :
                              item.status === 'error' ? 'bg-red-400' : 'bg-white/20'
                            }`} />
                          )}
                          <span className="text-[11px] text-white/60 truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                          {item.note && <span className="text-[10px] text-white/28">{item.note}</span>}
                          {item.value && (
                            <span className={`text-[11px] font-semibold ${
                              item.status === 'ok' ? 'text-emerald-400' :
                              item.status === 'warn' ? 'text-amber-400' :
                              item.status === 'error' ? 'text-red-400' :
                              'text-white/55'
                            }`}>
                              {item.value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {place.deepDetails.map((section) => (
                <div key={section.title}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">{section.title}</p>
                  <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                    {section.rows.map((row, i) => (
                      <div key={row.label} className={`flex items-center justify-between px-3 py-2 ${i < section.rows.length - 1 ? 'border-b border-white/[0.05]' : ''}`}>
                        <span className="text-[11px] text-white/45">{row.label}</span>
                        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                          {row.note && <span className="text-[10px] text-white/28 italic">{row.note}</span>}
                          <span className="text-[11px] font-semibold text-white/65">{row.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {place.relations.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">Relations</p>
                  <div className="space-y-1">
                    {place.relations.map((rel) => (
                      <div key={rel.place} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        {rel.placeId ? (
                          <Link href={`/places/${rel.placeId}`} className="text-xs font-semibold text-white/55 hover:text-white transition-colors flex items-center gap-1">
                            {rel.place}<ArrowRight size={9} />
                          </Link>
                        ) : (
                          <span className="text-xs font-semibold text-white/45">{rel.place}</span>
                        )}
                        <span className="text-[10px] text-white/28 italic">{rel.nature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden on mobile, shown on md+)
          Agent hero sits top of right column — unmissable.
          Color tile + observe panels on left, agent + inspect on right.
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — color tile + status + signals + relations */}
          <div className="lg:col-span-1 space-y-5">
            {/* Color tile — aggressive gradient */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden max-w-xs mx-auto lg:mx-0"
              style={{
                background: [
                  `radial-gradient(ellipse 100% 60% at 50% 0%, ${color}cc 0%, transparent 60%)`,
                  `linear-gradient(160deg, ${color}aa 0%, ${color}66 40%, #111111 75%)`,
                  color,
                ].join(', '),
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, ${color}ff, ${color}bb, transparent)` }}
              />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-black text-white">{place.shortLabel}</h2>
                <p className="text-[10px] text-white/55 uppercase tracking-wider">{place.descriptor}</p>
              </div>
            </div>

            {/* Readiness */}
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

          {/* Right — agent first, then observe */}
          <div className="lg:col-span-2 space-y-5">

            {/* Agent hero — top of right column, unmissable */}
            <AgentHero placeId={placeId} shortLabel={place.shortLabel} accentColor={color} />

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
              <InfoPanel key={section.title} title={section.title} rows={section.rows} />
            ))}

            {/* Supporting actions — desktop 2-col */}
            <ActionRail actions={place.actions} title="Quick Actions" columns={2} accentColor={color} />

          </div>
        </div>
      </div>

    </OperatorShell>

    {/* Persistent agent dock — always reachable while scrolling inspect data */}
    <MobileActionDock action={agentAction} accentColor={color} />
    </>
  );
}

export async function generateStaticParams() {
  return mockPlaceDetails.map((p) => ({ placeId: p.id }));
}
