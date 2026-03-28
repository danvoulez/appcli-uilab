/**
 * Query Client — frontend seam for read-model operations.
 *
 * Live control-plane reads are used where the backend already has an honest contract.
 * Everything else returns explicit SOON placeholders instead of fake operational data.
 */

import type {
  AnyInspector,
  CreationSession,
  LogView,
  PlaceDetail,
  PlaceSummary,
  Timeline,
} from './types';
import { getPlaceCatalogItem, PLACE_CATALOG, type PlaceCatalogItem } from './place-catalog';
import {
  buildLiveJobInspector,
  buildSoonInspector,
  buildSoonLogView,
  buildSoonPlaceDetail,
  buildSoonPlaceSummary,
  buildSoonSession,
  buildSoonTimeline,
  normalizeTimelineObjectType,
  severityFromEvent,
} from './soon';

type LivePlaceView = {
  place: string;
  title: string;
  summary: string;
  data: Record<string, unknown>;
};

type LiveInspectorView = {
  kind: string;
  id: string;
  body: Record<string, unknown>;
};

type LiveTimelineEntry = {
  at: string;
  kind: string;
  summary: string;
};

const LIVE_PLACE_IDS = new Set(['lab-256', 'lab-8gb', 'lab-512', 'supabase']);
const LIVE_INSPECTOR_KINDS = new Set(['job']);

class QueryClient {
  async listPlaces(): Promise<PlaceSummary[]> {
    const livePlaces = await fetchLivePlaces();

    return PLACE_CATALOG.map((item) => {
      const live = livePlaces.get(item.id);
      return live ? mergeLivePlaceSummary(item, live) : buildSoonPlaceSummary(item);
    });
  }

  async getPlace(placeId: string): Promise<PlaceDetail | null> {
    const item = getPlaceCatalogItem(placeId);
    if (!item) return null;

    const live = await fetchLivePlace(placeId);
    return live ? mergeLivePlaceDetail(item, live) : buildSoonPlaceDetail(item);
  }

  async getInspector(type: string, id: string): Promise<AnyInspector | null> {
    const normalized = type.trim().toLowerCase();
    const live = await fetchLiveInspector(normalized, id);

    if (live && normalized === 'job') {
      const job = live.body.job as Record<string, unknown> | undefined;
      const latestRun = live.body.latest_run as Record<string, unknown> | undefined;
      return buildLiveJobInspector(id, job, latestRun);
    }

    return buildSoonInspector(normalized, id);
  }

  async listInspectors(type: string): Promise<AnyInspector[]> {
    const normalized = type.trim().toLowerCase();
    const soon = buildSoonInspector(normalized, `${normalized}-soon`);
    return soon ? [soon] : [];
  }

  async getTimeline(objectType: string, objectId: string): Promise<Timeline | null> {
    const normalized = objectType.trim().toLowerCase();
    const liveEntries = await fetchLiveTimeline(normalized, objectId);

    if (liveEntries) {
      return {
        objectId,
        objectType: normalizeTimelineObjectType(normalized),
        objectLabel: `${normalized.toUpperCase()} ${objectId}`,
        events: liveEntries.map((entry, index) => ({
          id: `${objectId}-${index}`,
          timestamp: entry.at,
          actor: 'control-plane',
          actorType: 'system',
          message: entry.summary,
          severity: severityFromEvent(entry.kind),
          linkedObjectId: objectId,
          linkedObjectType: normalizeTimelineObjectType(normalized),
          linkedObjectLabel: `${normalized.toUpperCase()} ${objectId}`,
          metadata: { event_kind: entry.kind },
        })),
      };
    }

    return buildSoonTimeline(normalized, objectId);
  }

  async getLogView(sourceType: string, sourceId: string): Promise<LogView | null> {
    return buildSoonLogView(sourceType, sourceId);
  }

  async getSession(id: string): Promise<CreationSession | null> {
    return buildSoonSession(id);
  }

  async listSessions(): Promise<CreationSession[]> {
    return ['lab-id', 'supabase', 'workflows', 'lab-512'].map((deskType) =>
      buildSoonSession(`session-${deskType}-soon`)
    );
  }
}

async function fetchLivePlaces(): Promise<Map<string, LivePlaceView>> {
  const liveEntries = await Promise.all(
    Array.from(LIVE_PLACE_IDS).map(async (placeId) => {
      const live = await fetchLivePlace(placeId);
      return live ? ([placeId, live] as const) : null;
    })
  );

  return new Map(
    liveEntries.filter((entry): entry is readonly [string, LivePlaceView] => Boolean(entry))
  );
}

async function fetchLivePlace(placeId: string): Promise<LivePlaceView | null> {
  if (!LIVE_PLACE_IDS.has(placeId)) {
    return null;
  }

  try {
    const response = await fetch(`${controlPlaneBaseUrl()}/query/places/${placeId}`, {
      headers: {
        Authorization: `Bearer ${controlPlaneToken()}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return (await response.json()) as LivePlaceView;
  } catch {
    return null;
  }
}

async function fetchLiveInspector(type: string, id: string): Promise<LiveInspectorView | null> {
  if (!LIVE_INSPECTOR_KINDS.has(type) || !looksLikeUuid(id)) {
    return null;
  }

  try {
    const response = await fetch(`${controlPlaneBaseUrl()}/query/inspectors/${type}/${id}`, {
      headers: {
        Authorization: `Bearer ${controlPlaneToken()}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return (await response.json()) as LiveInspectorView;
  } catch {
    return null;
  }
}

async function fetchLiveTimeline(type: string, id: string): Promise<LiveTimelineEntry[] | null> {
  if (!(type === 'job' || type === 'project') || !looksLikeUuid(id)) {
    return null;
  }

  const liveKind = type === 'project' ? 'job' : type;

  try {
    const response = await fetch(`${controlPlaneBaseUrl()}/query/timelines/${liveKind}/${id}`, {
      headers: {
        Authorization: `Bearer ${controlPlaneToken()}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return (await response.json()) as LiveTimelineEntry[];
  } catch {
    return null;
  }
}

function mergeLivePlaceSummary(item: PlaceCatalogItem, live: LivePlaceView): PlaceSummary {
  return {
    id: item.id,
    title: live.title,
    shortLabel: live.title,
    descriptor: item.descriptor,
    shortSummary: live.summary,
    backgroundImage: item.backgroundImage,
    accentColor: item.accentColor,
    textColor: item.textColor,
    status: deriveStatus(item.id, live),
    statusLights: deriveStatusLights(live),
    primarySignals: deriveSignals(item.id, live),
    attention: deriveAttention(item.id, live),
  };
}

function mergeLivePlaceDetail(item: PlaceCatalogItem, live: LivePlaceView): PlaceDetail {
  const summary = mergeLivePlaceSummary(item, live);

  return {
    ...summary,
    overview: live.summary,
    panels: [snapshotPanel(live)],
    actions: [
      { id: 'agent', label: 'Open agent shell', variant: 'primary', href: `/places/${item.id}/agent` },
    ],
    deepDetails: [snapshotDetails(live)],
    relations: [],
  };
}

function deriveStatus(placeId: string, live: LivePlaceView): PlaceSummary['status'] {
  const pending = readNumber(live, 'pending_commands');
  const queued = readNumber(live, 'queued_jobs');
  const online = readNumber(live, 'online_nodes');

  if (online === 0) return 'offline';
  if (placeId === 'lab-8gb' && pending > 0) return 'warning';
  if (placeId === 'lab-512' && queued > 0) return 'syncing';
  return 'healthy';
}

function deriveStatusLights(live: LivePlaceView): PlaceSummary['statusLights'] {
  const pending = readNumber(live, 'pending_commands');
  const running = readNumber(live, 'running_jobs');

  return [
    { label: 'Connectivity', status: 'on' },
    { label: 'Integrity', status: 'on' },
    { label: 'Activity', status: pending > 0 || running > 0 ? 'warn' : 'on' },
  ];
}

function deriveSignals(placeId: string, live: LivePlaceView): PlaceSummary['primarySignals'] {
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

  return [
    { label: 'Nodes online', value: `${online}` },
    { label: 'Pending commands', value: `${pending}` },
    { label: 'Snapshot', value: 'live' },
  ];
}

function deriveAttention(placeId: string, live: LivePlaceView) {
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

function snapshotPanel(live: LivePlaceView): PlaceDetail['panels'][number] {
  return {
    title: 'Live Snapshot',
    items: [
      { label: 'Place', value: live.title, status: 'ok' },
      { label: 'Online nodes', value: `${readNumber(live, 'online_nodes')}`, status: 'ok' },
      { label: 'Queued jobs', value: `${readNumber(live, 'queued_jobs')}`, status: 'idle' },
      { label: 'Running jobs', value: `${readNumber(live, 'running_jobs')}`, status: 'ok' },
      { label: 'Completed jobs', value: `${readNumber(live, 'completed_jobs')}`, status: 'ok' },
      {
        label: 'Pending commands',
        value: `${readNumber(live, 'pending_commands')}`,
        status: readNumber(live, 'pending_commands') > 0 ? 'warn' : 'ok',
      },
    ],
  };
}

function snapshotDetails(live: LivePlaceView): PlaceDetail['deepDetails'][number] {
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

function controlPlaneBaseUrl(): string {
  return (process.env.MODES_CONTROL_PLANE_BASE_URL ?? 'http://127.0.0.1:8080').replace(/\/+$/, '');
}

function controlPlaneToken(): string {
  return process.env.MODES_DEV_OPERATOR_TOKEN ?? 'modes-dev-operator';
}

function looksLikeUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const queryClient = new QueryClient();
