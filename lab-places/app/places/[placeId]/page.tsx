import { notFound } from 'next/navigation';
import Link from 'next/link';
import { queryClient } from '@/lib/query-client';
import { StatusChip } from '@/components/StatusChip';
import { ActionRail } from '@/components/shell/ActionRail';
import { InfoPanel } from '@/components/shell/InfoPanel';
import { ObjectPanel } from '@/components/shell/ObjectPanel';
import { AlertTriangle, ArrowLeft, MessageSquare } from 'lucide-react';

interface Props {
  params: Promise<{ placeId: string }>;
}

// ── Shared sub-components ────────────────────────────────────────────────────

function AgentHero({ placeId, shortLabel, color }: { placeId: string; shortLabel: string; color: string }) {
  return (
    <Link
      href={`/places/${placeId}/agent`}
      className="group relative flex items-center justify-between w-full rounded-2xl overflow-hidden transition-all duration-150 active:scale-[0.99]"
      style={{
        background: [
          `radial-gradient(ellipse 80% 130% at 0% 50%, ${color}dd 0%, transparent 55%)`,
          `linear-gradient(135deg, ${color}bb 0%, ${color}77 50%, ${color}44 100%)`,
        ].join(', '),
        border: `1px solid ${color}66`,
        padding: '18px 22px',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${color}ff, ${color}88, transparent)` }}
      />
      <div>
        {/* mobile: bigger subtitle / desktop: slightly smaller */}
        <p className="text-[11px] md:text-[9px] font-bold uppercase tracking-[0.14em] text-white/55 mb-1">
          every action · every question
        </p>
        <p className="text-lg md:text-base font-black text-white leading-none tracking-tight">
          Talk to {shortLabel} agent
        </p>
      </div>
      <div className="flex-shrink-0 ml-4 w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 border border-white/20 transition-all duration-150">
        <MessageSquare size={18} className="text-white md:hidden" />
        <MessageSquare size={17} className="text-white hidden md:block" />
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PlacePage({ params }: Props) {
  const { placeId } = await params;
  const place = await queryClient.getPlace(placeId);
  if (!place) notFound();

  const color = place.accentColor;

  const Header = (
    <header className="flex-shrink-0 pt-safe px-4 md:px-8 pb-2.5 border-b border-white/[0.06]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-1.5">
        <Link
          href="/"
          className="flex items-center gap-1 text-[11px] md:text-[9px] font-bold uppercase tracking-[0.14em] text-white/30 hover:text-white/55 transition-colors"
        >
          <ArrowLeft size={10} />
          minilab.work
        </Link>
        <span className="text-[11px] md:text-[9px] text-white/18">/</span>
        <span
          className="text-[11px] md:text-[9px] font-bold uppercase tracking-[0.12em]"
          style={{ color: `${color}cc` }}
        >
          {place.shortLabel}
        </span>
      </nav>
      {/* Title + status */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl md:text-xl font-black text-white tracking-tight leading-none">
          {place.shortLabel}
        </h1>
        <StatusChip status={place.status} />
      </div>
      <p className="text-[11px] md:text-[9px] font-bold uppercase tracking-[0.15em] text-white/28 mt-1">
        {place.descriptor}
      </p>
    </header>
  );

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          MOBILE — hard fixed viewport, NO scroll anywhere.
          Banner flexes to fill; all other rows are fixed-size.
          ════════════════════════════════════════════════════════════════ */}
      {/* 100svh = small viewport height: sized for the browser-chrome-visible state.
          Prevents the container from extending behind the address bar.
          In standalone/PWA mode svh == dvh == lvh (no browser chrome). */}
      <div className="md:hidden h-[100svh] bg-[#0e0e0e] overflow-hidden flex flex-col">

        <div className="fixed inset-0 pointer-events-none opacity-[0.02]" aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        {Header}

        {/* Content — flex column, strictly proportional, no overflow property */}
        <div className="relative z-10 flex-1 min-h-0 flex flex-col px-3 pt-2 pb-safe gap-1.5">

          {/* 1. Color banner — expands to fill remaining space */}
          <div
            className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col justify-between"
            style={{
              background: [
                `radial-gradient(ellipse 130% 70% at 50% 0%, ${color}dd 0%, transparent 60%)`,
                `radial-gradient(ellipse 80% 60% at 0% 100%, ${color}77 0%, transparent 50%)`,
                `linear-gradient(165deg, ${color}aa 0%, ${color}66 30%, #111111 65%)`,
                '#141414',
              ].join(', '),
              border: `1px solid ${color}55`,
              boxShadow: `inset 0 1px 0 ${color}cc`,
            }}
          >
            <div className="flex items-start justify-between px-4 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: `${color}ee` }}>
                {place.descriptor}
              </p>
              {place.attention && (
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <AlertTriangle size={10} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-300 truncate max-w-[110px]">
                    {place.attention.title}
                  </span>
                </div>
              )}
            </div>
            <div className="px-4 pb-5">
              <h2 className="text-[2.4rem] font-black text-white leading-none tracking-tight">
                {place.shortLabel}
              </h2>
              <p className="text-[13px] text-white/46 mt-1.5 leading-snug max-w-[230px]">
                {place.shortSummary}
              </p>
            </div>
          </div>

          {/* 2. Health strip — fixed height */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-1.5">
            <div className="px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/25 mb-1">Readiness</p>
              {place.statusLights.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-1 py-[3px]">
                  <span className="text-[12px] text-white/42 truncate">{l.label}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    l.status === 'on' ? 'bg-emerald-400' : l.status === 'warn' ? 'bg-amber-400' : 'bg-white/18'
                  }`} />
                </div>
              ))}
            </div>
            <div className="px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/25 mb-1">Signals</p>
              {place.primarySignals.slice(0, 3).map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-1 py-[3px]">
                  <span className="text-[12px] text-white/38 truncate">{s.label}</span>
                  <span className="text-[12px] font-bold text-white/78 flex-shrink-0">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Agent hero — fixed height, intentionally large CTA */}
          <div className="flex-shrink-0">
            <AgentHero placeId={placeId} shortLabel={place.shortLabel} color={color} />
          </div>

          {/* 4. Action rail — non-href actions route to agent chat */}
          <div className="flex-shrink-0">
            <ActionRail
              actions={place.actions.slice(0, 5)}
              title=""
              columns={1}
              accentColor={color}
              agentHref={`/places/${placeId}/agent`}
            />
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP — fixed h-screen, rich 3-col, internal scrollbar-none
          ════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex h-[100svh] bg-[#0e0e0e] overflow-hidden flex-col">

        <div className="fixed inset-0 pointer-events-none opacity-[0.02]" aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        {Header}

        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto scrollbar-none">
          <div className="max-w-6xl mx-auto px-8 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Left col */}
              <div className="lg:col-span-1 space-y-3">

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
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, ${color}ff, ${color}bb, transparent)` }} />
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

              {/* Right col */}
              <div className="lg:col-span-2 space-y-3">

                <AgentHero placeId={placeId} shortLabel={place.shortLabel} color={color} />

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28 mb-2">Overview</p>
                  <p className="text-sm text-white/60 leading-relaxed">{place.overview}</p>
                </div>

                {place.attention && (
                  <div className="flex gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                    <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                        {place.attention.title}
                      </p>
                      <p className="text-sm text-amber-200/60 leading-relaxed">{place.attention.body}</p>
                    </div>
                  </div>
                )}

                {place.panels.map((panel) => (
                  <ObjectPanel key={panel.title} title={panel.title} items={panel.items} />
                ))}

                {place.deepDetails.map((section) => (
                  <InfoPanel key={section.title} title={section.title} rows={section.rows} />
                ))}

                <ActionRail actions={place.actions} title="Quick Actions" columns={2} accentColor={color} agentHref={`/places/${placeId}/agent`} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const places = await queryClient.listPlaces();
  return places.map((p) => ({ placeId: p.id }));
}
