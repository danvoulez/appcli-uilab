import { NextResponse } from 'next/server';

import type { AgentRuntimeAction, AgentRuntimeSessionSnapshot } from '@/lib/agent-runtime';
import { isTerminalRunStatus } from '@/lib/agent-runtime';

type ControlPlaneInspector = {
  body?: {
    session?: Record<string, unknown>;
    latest_run?: Record<string, unknown> | null;
    messages?: Array<Record<string, unknown>>;
  };
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;
  const response = await fetch(`${controlPlaneBaseUrl()}/query/inspectors/agent_session/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${controlPlaneToken()}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Agent session not found.' }, { status: response.status });
  }

  const inspector = (await response.json()) as ControlPlaneInspector;
  const snapshot = normalizeAgentSession(inspector);
  if (!snapshot) {
    return NextResponse.json({ error: 'Agent session payload was invalid.' }, { status: 502 });
  }

  return NextResponse.json(snapshot);
}

function normalizeAgentSession(inspector: ControlPlaneInspector): AgentRuntimeSessionSnapshot | null {
  const body = inspector.body ?? {};
  const session = readObject(body.session);
  const latestRun = readNullableObject(body.latest_run);
  const messages = Array.isArray(body.messages) ? body.messages.filter(isRecord) : [];
  const latestAgentMessage = [...messages].reverse().find((message) => message.role === 'agent');
  const structured = readNullableObject(latestAgentMessage?.structured_payload_json);
  const action = normalizeAction(readNullableObject(structured?.action));
  const runStatus = readString(latestRun?.status);

  const normalizedSessionId = readString(session.id);
  if (!normalizedSessionId) return null;

  return {
    sessionId: normalizedSessionId,
    sessionStatus: readString(session.status) ?? 'open',
    runId: readString(latestRun?.id),
    runStatus,
    outputKind: readString(latestRun?.output_kind) ?? readString(structured?.output_kind),
    replyText: readString(latestAgentMessage?.content),
    action,
    updatedAt: readString(session.updated_at),
    pending: !isTerminalRunStatus(runStatus) || !latestAgentMessage,
  };
}

function normalizeAction(value: Record<string, unknown> | null): AgentRuntimeAction | null {
  if (!value) return null;
  const actionKind = readString(value.action_kind);
  const targetPlace = readString(value.target_place);
  const status = readString(value.status);
  if (!actionKind || !targetPlace || !status) return null;
  return { actionKind, targetPlace, status };
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readObject(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function readNullableObject(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function controlPlaneBaseUrl(): string {
  return (process.env.MODES_CONTROL_PLANE_BASE_URL ?? 'http://127.0.0.1:8080').replace(/\/+$/, '');
}

function controlPlaneToken(): string {
  return process.env.MODES_DEV_OPERATOR_TOKEN ?? 'modes-dev-operator';
}
