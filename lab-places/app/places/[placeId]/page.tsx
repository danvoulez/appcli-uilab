import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockPlaceDetails } from '@/lib/mocks';
import { OperatorShell } from '@/components/shell/OperatorShell';
import { StatusChip } from '@/components/StatusChip';
import { StatusLights } from '@/components/StatusLights';
import { ActionRail } from '@/components/shell/ActionRail';
import { InfoPanel } from '@/components/shell/InfoPanel';
import { ObjectPanel } from '@/components/shell/ObjectPanel';
import { MobileActionDock } from '@/components/shell/MobileActionDock';
import { CollapsibleSection } from '@/components/shell/CollapsibleSection';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ placeId: string }>;
}

export default async function PlacePage({ params }: Props) {
  const { placeId } = await params;
  const place = mockPlaceDetails.find((p) => p.id === placeId);
  if (!place) notFound();

  const color = place.accentColor;

  // Primary action for the dock and the mobile CTA block
  const primaryAction = place.actions.find(a => a.variant === 'primary') ?? place.actions[0];
  // Secondary actions for the dock (non-danger, non-primary, with href)
  const dockSecondary = place.actions
    .filter(a => a !== primaryAction && a.variant !== 'danger' && a.href)
    .slice(0, 1);

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
            Hierarchy: profile banner → health strip → primary action
                       → action cluster → attention → inspect (collapsible)
            ══════════════════════════════════════════════════════════════ */}
        <div className="md:hidden space-y-4 pb-28">

          {/* 1. Place profile banner — carries the accent color */}
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              background: [
                `radial-gradient(ellipse 100% 55% at 50% 0%, ${color}70 0%, transparent 70%)`,
                `linear-gradient(160deg, ${color}55 0%, ${color}30 40%, #111111 75%)`,
                '#141414',
              ].join(', '),
              border: `1px solid ${color}38`,
              minHeight: '120px',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${color}aa, transparent)` }}
            />
            <div className="px-5 py-5 flex items-end justify-between">
              <div className="space-y-1">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: `${color}cc` }}
                >
                  {place.descriptor}
                </p>
                <h2 className="text-2xl font-black text-white tracking-tight leading-none">{place.shortLabel}</h2>
                <p className="text-xs text-white/50 leading-snug max-w-[220px]">{place.shortSummary}</p>
              </div>
              <StatusChip status={place.status} />
            </div>
          </div>

          {/* 2. Compact health strip — status lights + key signals */}
          <div className="grid grid-cols-2 gap-3">
            {/* Status lights */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">Readiness</p>
              {place.statusLights.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] text-white/45 truncate">{l.label}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    l.status === 'on' ? 'bg-emerald-400' : l.status === 'warn' ? 'bg-amber-400' : 'bg-white/20'
                  }`} />
                </div>
              ))}
            </div>
            {/* Key signals */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">Signals</p>
              {place.primarySignals.slice(0, 3).map((s) => (
                <div key={s.label} className="flex items-start justify-between gap-1.5">
                  <span className="text-[10px] text-white/40 truncate">{s.label}</span>
                  <span className="text-[10px] font-bold text-white/75 text-right flex-shrink-0">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Primary action — full-width, accent-tinted, place-specific */}
          <div>
            {primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className="flex items-center justify-between w-full px-5 py-4 rounded-xl text-sm font-bold text-white transition-all duration-150 active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${color}65 0%, ${color}40 100%)`,
                  border: `1px solid ${color}55`,
                }}
              >
                <span>{primaryAction.label}</span>
                <ArrowRight size={15} className="opacity-75 flex-shrink-0" />
              </Link>
            ) : (
              <button
                disabled={primaryAction.disabled}
                className="flex items-center justify-between w-full px-5 py-4 rounded-xl text-sm font-bold text-white transition-all duration-150 active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${color}65 0%, ${color}40 100%)`,
                  border: `1px solid ${color}55`,
                }}
              >
                <span>{primaryAction.label}</span>
                <ArrowRight size={15} className="opacity-75 flex-shrink-0" />
              </button>
            )}
          </div>

          {/* 4. Action cluster — remaining actions, single column */}
          <ActionRail
            actions={place.actions.filter(a => a !== primaryAction)}
            title="Actions"
            columns={1}
            accentColor={color}
          />

          {/* 5. Attention block — if present */}
          {place.attention && (
            <div className="flex gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  {place.attention.title}
                </p>
                <p className="text-sm text-amber-200/65 leading-relaxed">{place.attention.body}</p>
              </div>
            </div>
          )}

          {/* 6. Overview — collapsible */}
          <CollapsibleSection title="Overview" accentColor={color}>
            <p className="text-sm text-white/60 leading-relaxed">{place.overview}</p>
          </CollapsibleSection>

          {/* 7. Inspect — panels, deep details, relations — collapsible */}
          {(place.panels.length > 0 || place.deepDetails.length > 0 || place.relations.length > 0) && (
            <CollapsibleSection title="Inspect" accentColor={color}>
              <div className="space-y-4">
                {/* Panels */}
                {place.panels.map((panel) => (
                  <div key={panel.title}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">{panel.title}</p>
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                      {panel.items.map((item, i) => (
                        <div
                          key={item.label}
                          className={`flex items-center justify-between px-3 py-2 ${i < panel.items.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
                        >
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
                                item.status === 'idle' ? 'text-white/30' : 'text-white/60'
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

                {/* Deep details */}
                {place.deepDetails.map((section) => (
                  <div key={section.title}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">{section.title}</p>
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                      {section.rows.map((row, i) => (
                        <div
                          key={row.label}
                          className={`flex items-center justify-between px-3 py-2 ${i < section.rows.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
                        >
                          <span className="text-[11px] text-white/45">{row.label}</span>
                          <div className="flex items-center gap-1.5 ml-2 flex-shrink-0 text-right">
                            {row.note && <span className="text-[10px] text-white/28 italic">{row.note}</span>}
                            <span className="text-[11px] font-semibold text-white/65">{row.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Relations */}
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
            Inspect-rich three-column layout preserved.
            ══════════════════════════════════════════════════════════════ */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — image + overview */}
            <div className="lg:col-span-1 space-y-5">
              {/* Card color tile */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden max-w-xs mx-auto lg:mx-0"
                style={{ backgroundColor: color }}
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

              {/* Actions — accent-tinted primary on desktop too */}
              <ActionRail actions={place.actions} title="Actions" columns={2} accentColor={color} />
            </div>
          </div>
        </div>

      </OperatorShell>

      {/* Sticky mobile action dock — always visible while scrolling */}
      <MobileActionDock
        action={primaryAction}
        accentColor={color}
        secondaryActions={dockSecondary}
      />
    </>
  );
}

export async function generateStaticParams() {
  return mockPlaceDetails.map((p) => ({ placeId: p.id }));
}
