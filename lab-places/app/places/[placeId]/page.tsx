import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockPlaceDetails } from '@/lib/mocks';
import { StatusChip } from '@/components/StatusChip';
import { ActionRail } from '@/components/shell/ActionRail';
import { InfoPanel } from '@/components/shell/InfoPanel';
import { ObjectPanel } from '@/components/shell/ObjectPanel';
import { AlertTriangle, ArrowLeft, MessageSquare } from 'lucide-react';

interface Props {
  params: Promise<{ placeId: string }>;
}

function AgentHero({ placeId, shortLabel, color }: { placeId: string; shortLabel: string; color: string }) {
  return (
    <Link
      href={`/places/${placeId}/agent`}
      className="group relative flex items-center justify-between w-full rounded-xl overflow-hidden transition-all duration-150 active:scale-[0.99]"
      style={{
        background: [
          `radial-gradient(ellipse 80% 120% at 0% 50%, ${color}cc 0%, transparent 55%)`,
          `linear-gradient(135deg, ${color}aa 0%, ${color}66 55%, ${color}33 100%)`,
        ].join(', '),
        border: `1px solid ${color}60`,
        padding: '14px 18px',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${color}ff, ${color}77, transparent)` }}
      />
      <div className="space-y-0.5">
        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/50">
          every action · every question
        </p>
        <p className="text-sm font-black text-white leading-tight tracking-tight">
          Talk to {shortLabel} agent
        </p>
      </div>
      <div className="flex-shrink-0 ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/12 group-hover:bg-white/22 border border-white/18 transition-all duration-150">
        <MessageSquare size={13} className="text-white" />
      </div>
    </Link>
  );
}

export default async function PlacePage({ params }: Props) {
  const { placeId } = await params;
  const place = mockPlaceDetails.find((p) => p.id === placeId);
  if (!place) notFound();

  const color = place.accentColor;

  return (
    <div className="h-screen bg-[#0e0e0e] overflow-hidden flex flex-col">

      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '28px 28px' }}
        aria-hidden="true"
      />

      {/* ── Back nav ──────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex-shrink-0 flex items-center px-4 md:px-8 py-2.5 border-b border-white/[0.06]">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 hover:text-white/65 transition-colors"
        >
          <ArrowLeft size={10} />
          LAB Places
        </Link>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE — fixed single-viewport, no scroll
          ══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative z-10 flex-1 flex flex-col px-3.5 pt-2.5 pb-3 gap-2 overflow-hidden min-h-0">

        {/* 1. Profile banner — constrained to ~38% so action area has room */}
        <div
          className="relative flex-[0_0_38%] min-h-0 rounded-2xl overflow-hidden flex flex-col justify-between"
          style={{
            background: [
              `radial-gradient(ellipse 120% 65% at 50% 0%, ${color}cc 0%, transparent 60%)`,
              `radial-gradient(ellipse 80% 55% at 0% 100%, ${color}66 0%, transparent 50%)`,
              `linear-gradient(165deg, ${color}99 0%, ${color}55 35%, #111111 68%)`,
              '#141414',
            ].join(', '),
            border: `1px solid ${color}50`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, ${color}ff, ${color}bb 40%, transparent)` }}
          />

          <div className="flex items-center justify-between px-4 pt-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: `${color}ee` }}>
              {place.descriptor}
            </p>
            <StatusChip status={place.status} />
          </div>

          <div className="px-4 pb-4">
            <h2 className="text-[2rem] font-black text-white leading-none tracking-tight">
              {place.shortLabel}
            </h2>
            <p className="text-[11px] text-white/50 mt-1 leading-snug max-w-[200px]">
              {place.shortSummary}
            </p>
            {place.attention && (
              <div className="flex items-center gap-1.5 mt-2.5">
                <AlertTriangle size={10} className="text-amber-400 flex-shrink-0" />
                <p className="text-[10px] font-semibold text-amber-300 truncate">{place.attention.title}</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Compact health strip */}
        <div className="flex-shrink-0 grid grid-cols-2 gap-2">
          <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] space-y-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/28">Readiness</p>
            {place.statusLights.map((l) => (
              <div key={l.label} className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-white/45 truncate">{l.label}</span>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  l.status === 'on' ? 'bg-emerald-400' : l.status === 'warn' ? 'bg-amber-400' : 'bg-white/20'
                }`} />
              </div>
            ))}
          </div>
          <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] space-y-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/28">Signals</p>
            {place.primarySignals.slice(0, 3).map((s) => (
              <div key={s.label} className="flex items-start justify-between gap-1">
                <span className="text-[10px] text-white/40 truncate">{s.label}</span>
                <span className="text-[10px] font-bold text-white/80 flex-shrink-0">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Agent hero */}
        <div className="flex-shrink-0">
          <AgentHero placeId={placeId} shortLabel={place.shortLabel} color={color} />
        </div>

        {/* 4. Full action rail */}
        <div className="flex-shrink-0">
          <ActionRail
            actions={place.actions.slice(0, 4)}
            title=""
            columns={2}
            accentColor={color}
          />
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP — scrollable, inspect-rich
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative z-10 flex-1 overflow-y-auto scrollbar-none">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left — color tile + readiness + signals + relations */}
            <div className="lg:col-span-1 space-y-3.5">
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
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">{place.descriptor}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-2">Readiness</p>
                <div className="space-y-1.5">
                  {place.statusLights.map((l) => (
                    <div key={l.label} className="flex items-center justify-between">
                      <span className="text-xs text-white/48">{l.label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          l.status === 'on' ? 'bg-emerald-400' : l.status === 'warn' ? 'bg-amber-400' : 'bg-white/20'
                        }`} />
                        <span className={`text-xs font-semibold ${
                          l.status === 'on' ? 'text-emerald-400' : l.status === 'warn' ? 'text-amber-400' : 'text-white/28'
                        }`}>
                          {l.status === 'on' ? 'Online' : l.status === 'warn' ? 'Warning' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-2">Key Signals</p>
                <div className="space-y-1.5">
                  {place.primarySignals.map((s) => (
                    <div key={s.label} className="flex items-start justify-between">
                      <span className="text-xs text-white/43">{s.label}</span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white/78">{s.value}</span>
                        {s.note && <p className="text-[10px] text-white/28">{s.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {place.relations.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-1.5">Relations</p>
                  <div className="space-y-1">
                    {place.relations.map((rel) => (
                      <div key={rel.place} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        {rel.placeId ? (
                          <Link href={`/places/${rel.placeId}`} className="text-xs font-semibold text-white/55 hover:text-white transition-colors">
                            {rel.place}
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

            {/* Right — agent first, then inspect */}
            <div className="lg:col-span-2 space-y-3.5">

              <AgentHero placeId={placeId} shortLabel={place.shortLabel} color={color} />

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-2">Overview</p>
                <p className="text-sm text-white/62 leading-relaxed">{place.overview}</p>
              </div>

              {place.attention && (
                <div className="flex gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                      {place.attention.title}
                    </p>
                    <p className="text-sm text-amber-200/62 leading-relaxed">{place.attention.body}</p>
                  </div>
                </div>
              )}

              {place.panels.map((panel) => (
                <ObjectPanel key={panel.title} title={panel.title} items={panel.items} />
              ))}

              {place.deepDetails.map((section) => (
                <InfoPanel key={section.title} title={section.title} rows={section.rows} />
              ))}

              <ActionRail actions={place.actions} title="Quick Actions" columns={2} accentColor={color} />

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export async function generateStaticParams() {
  return mockPlaceDetails.map((p) => ({ placeId: p.id }));
}
