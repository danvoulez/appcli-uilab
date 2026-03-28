/**
 * Query Client — frontend seam for read-model operations.
 *
 * Currently powered by local mocks. When the Rust query API is ready,
 * replace the mock adapter below with real HTTP/SSE calls.
 *
 * Pattern: all methods return promises to make the swap transparent.
 */

import type {
  PlaceSummary,
  PlaceDetail,
  StatusLevel,
  StatusLight,
  Signal,
  Panel,
  DetailSection,
  Attention,
  AnyInspector,
  Timeline,
  LogView,
  CreationSession,
} from './types';
import {
  mockPlaceSummaries,
  mockPlaceDetails,
  mockInspectors,
  mockTimelines,
  mockLogViews,
  mockSessions,
} from './mocks';

type LivePlaceView = {
  place: string;
  title: string;
  summary: string;
  data: Record<string, unknown>;
};

const LIVE_PLACE_IDS = new Set(['lab-256', 'lab-8gb', 'lab-512', 'supabase']);

class QueryClient {
  // ─── Places ──────────────────────────────────────────────────────────────

  async listPlaces(): Promise<PlaceSummary[]> {
    const livePlaces = await fetchLivePlaces();

    return mockPlaceSummaries.map((place) => {
      const live = livePlaces.get(place.id);
      return live ? mergeLivePlaceSummary(place, live) : place;
    });
  }

  async getPlace(placeId: string): Promise<PlaceDetail | null> {
    const mock = mockPlaceDetails.find((p) => p.id === placeId) ?? null;
    if (!mock) return null;

    const live = await fetchLivePlace(placeId);
    return live ? mergeLivePlaceDetail(mock, live) : mock;
  }

  // ─── Inspectors ──────────────────────────────────────────────────────────

  async getInspector(type: string, id: string): Promise<AnyInspector | null> {
    await delay(120);
    return mockInspectors.find((i) => i.type === type && i.id === id) ?? null;
  }

  async listInspectors(type: string): Promise<AnyInspector[]> {
    await delay(100);
    return mockInspectors.filter((i) => i.type === type);
  }

  // ─── Timelines ───────────────────────────────────────────────────────────

  async getTimeline(objectType: string, objectId: string): Promise<Timeline | null> {
    await delay(110);
    return mockTimelines.find((t) => t.objectType === objectType && t.objectId === objectId) ?? null;
  }

  // ─── Logs ────────────────────────────────────────────────────────────────

  async getLogView(sourceType: string, sourceId: string): Promise<LogView | null> {
    await delay(130);
    return mockLogViews.find((l) => l.sourceType === sourceType && l.sourceId === sourceId) ?? null;
  }

  // ─── Sessions ────────────────────────────────────────────────────────────

  async getSession(id: string): Promise<CreationSession | null> {
    await delay(90);
    return mockSessions.find((s) => s.id === id) ?? null;
  }

  async listSessions(): Promise<CreationSession[]> {
    await delay(90);
    return mockSessions;
  }
}

async function fetchLivePlaces(): Promise<Map<string, LivePlaceView>> {
  const liveEntries = await Promise.all(
    Array.from(LIVE_PLACE_IDS).map(async (placeId) => {
      const live = await fetchLivePlace(placeId);
      return live ? ([placeId, live] as const) : null;
    })
  );

  return new Map(liveEntries.filter((entry): entry is readonly [string, LivePlaceView] => Boolean(entry)));
}

async function fetchLivePlace(placeId: string): Promise<LivePlaceView | null> {
  if (!LIVE_PLACE_IDS.has(placeId)) {
    return null;
  }

  const baseUrl = (process.env.MODES_CONTROL_PLANE_BASE_URL ?? 'http://127.0.0.1:8080').replace(/\/+$/, '');
  const token = process.env.MODES_DEV_OPERATOR_TOKEN ?? 'modes-dev-operator';

  try {
    const response = await fetch(`${baseUrl}/query/places/${placeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as LivePlaceView;
  } catch {
    return null;
  }
}

function mergeLivePlaceSummary(mock: PlaceSummary, live: LivePlaceView): PlaceSummary {
  return {
    ...mock,
    title: live.title,
    shortLabel: live.title,
    shortSummary: live.summary,
    status: deriveStatus(mock.id, live),
    statusLights: deriveStatusLights(live),
    primarySignals: deriveSignals(mock.id, live),
    attention: deriveAttention(mock.id, live),
  };
}

function mergeLivePlaceDetail(mock: PlaceDetail, live: LivePlaceView): PlaceDetail {
  const livePanel = snapshotPanel(live);
  const liveDetails = snapshotDetails(live);

  return {
    ...mock,
    title: live.title,
    shortLabel: live.title,
    shortSummary: live.summary,
    overview: live.summary,
    status: deriveStatus(mock.id, live),
    statusLights: deriveStatusLights(live),
    primarySignals: deriveSignals(mock.id, live),
    attention: deriveAttention(mock.id, live),
    panels: [livePanel, ...mock.panels.slice(1)],
    deepDetails: [liveDetails, ...mock.deepDetails.slice(1)],
  };
}

function deriveStatus(placeId: string, live: LivePlaceView): StatusLevel {
  const pending = readNumber(live, 'pending_commands');
  const queued = readNumber(live, 'queued_jobs');
  const online = readNumber(live, 'online_nodes');

  if (online === 0) return 'offline';
  if (placeId === 'lab-8gb' && pending > 0) return 'warning';
  if (placeId === 'lab-512' && queued > 0) return 'syncing';
  return 'healthy';
}

function deriveStatusLights(live: LivePlaceView): StatusLight[] {
  const pending = readNumber(live, 'pending_commands');
  const running = readNumber(live, 'running_jobs');

  return [
    { label: 'Connectivity', status: 'on' },
    { label: 'Integrity', status: 'on' },
    { label: 'Activity', status: pending > 0 || running > 0 ? 'warn' : 'on' },
  ];
}

function deriveSignals(placeId: string, live: LivePlaceView): Signal[] {
  const queued = readNumber(live, 'queued_jobs');
  const running = readNumber(live, 'running_jobs');
  const completed = readNumber(live, 'completed_jobs');
  const pending = readNumber(live, 'pending_commands');
  const online = readNumber(live, 'online_nodes');

  if (placeId === 'lab-256') {
    return [
      { label: 'Nodes online', value: `${online}` },
      { label: 'Queued jobs', value: `${queued}` },
      { label: 'Pending commands', value: `${pending}` },
    ];
  }

  if (placeId === 'lab-8gb') {
    return [
      { label: 'Running jobs', value: `${running}` },
      { label: 'Pending commands', value: `${pending}` },
      { label: 'Completed jobs', value: `${completed}` },
    ];
  }

  if (placeId === 'lab-512') {
    return [
      { label: 'Queue depth', value: `${queued} jobs` },
      { label: 'Running jobs', value: `${running}` },
      { label: 'Completed jobs', value: `${completed}` },
    ];
  }

  if (placeId === 'supabase') {
    return [
      { label: 'Nodes online', value: `${online}` },
      { label: 'Pending commands', value: `${pending}` },
      { label: 'Snapshot', value: 'live' },
    ];
  }

  return [];
}

function deriveAttention(placeId: string, live: LivePlaceView): Attention | null {
  const pending = readNumber(live, 'pending_commands');
  const queued = readNumber(live, 'queued_jobs');

  if (placeId === 'lab-8gb' && pending > 0) {
    return {
      title: 'Pending edge commands',
      body: `${pending} commands are still waiting at the edge surface.`,
    };
  }

  if (placeId === 'lab-512' && queued > 0) {
    return {
      title: 'Queued compute work',
      body: `${queued} jobs are queued for LAB 512.`,
    };
  }

  return null;
}

function snapshotPanel(live: LivePlaceView): Panel {
  return {
    title: 'Live Snapshot',
    items: [
      { label: 'Place', value: live.title, status: 'ok' },
      { label: 'Online nodes', value: `${readNumber(live, 'online_nodes')}`, status: 'ok' },
      { label: 'Queued jobs', value: `${readNumber(live, 'queued_jobs')}`, status: 'idle' },
      { label: 'Running jobs', value: `${readNumber(live, 'running_jobs')}`, status: 'ok' },
      { label: 'Completed jobs', value: `${readNumber(live, 'completed_jobs')}`, status: 'ok' },
      { label: 'Pending commands', value: `${readNumber(live, 'pending_commands')}`, status: readNumber(live, 'pending_commands') > 0 ? 'warn' : 'ok' },
    ],
  };
}

function snapshotDetails(live: LivePlaceView): DetailSection {
  return {
    title: 'Live Control Plane',
    rows: [
      { label: 'Summary', value: live.summary },
      { label: 'Online nodes', value: `${readNumber(live, 'online_nodes')}` },
      { label: 'Queued jobs', value: `${readNumber(live, 'queued_jobs')}` },
      { label: 'Running jobs', value: `${readNumber(live, 'running_jobs')}` },
      { label: 'Completed jobs', value: `${readNumber(live, 'completed_jobs')}` },
      { label: 'Pending commands', value: `${readNumber(live, 'pending_commands')}` },
    ],
  };
}

function readNumber(live: LivePlaceView, key: string): number {
  const value = live.data[key];
  return typeof value === 'number' ? value : 0;
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export const queryClient = new QueryClient();
