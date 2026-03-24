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

class QueryClient {
  // ─── Places ──────────────────────────────────────────────────────────────

  async listPlaces(): Promise<PlaceSummary[]> {
    await delay(80);
    return mockPlaceSummaries;
  }

  async getPlace(placeId: string): Promise<PlaceDetail | null> {
    await delay(100);
    return mockPlaceDetails.find((p) => p.id === placeId) ?? null;
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

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export const queryClient = new QueryClient();
