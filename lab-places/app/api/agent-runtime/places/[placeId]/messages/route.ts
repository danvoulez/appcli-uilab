import { NextRequest, NextResponse } from 'next/server';

import type {
  AgentRuntimeAction,
  AgentRuntimeSessionSnapshot,
  AgentRuntimeTurnResult,
} from '@/lib/agent-runtime';
import { isTerminalRunStatus } from '@/lib/agent-runtime';

type ControlPlaneSendOutcome = {
  session_id: string;
  run_id: string;
  output_kind: string;
  status: string;
  text: string;
};

type ControlPlaneInspector = {
  body?: {
    session?: Record<string, unknown>;
    latest_run?: Record<string, unknown> | null;
    messages?: Array<Record<string, unknown>>;
  };
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await context.params;
  const payload = await request.json();

  const response = await fetch(`${controlPlaneBaseUrl()}/api/agent-runtime/places/${placeId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${controlPlaneToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: payload.sessionId ?? null,
      text: payload.text ?? '',
      files: Array.isArray(payload.attachments)
        ? payload.attachments.map((file: Record<string, unknown>) => ({
            name: String(file.name ?? 'attachment'),
            size_bytes: Number(file.size ?? 0),
            mime_type: String(file.mimeType ?? 'application/octet-stream'),
          }))
        : [],
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    return NextResponse.json({ error: message }, { status: response.status });
  }

  const ack = (await response.json()) as ControlPlaneSendOutcome;
  const snapshot = await waitForSessionSnapshot(ack.session_id, ack.run_id, 4, 500);

  const result: AgentRuntimeTurnResult = {
    sessionId: ack.session_id,
    runId: ack.run_id,
    pending: !snapshot || snapshot.pending,
    sessionStatus: snapshot?.sessionStatus ?? ack.status,
    acknowledgement: ack.text,
    replyText: snapshot?.replyText,
    outputKind: snapshot?.outputKind ?? ack.output_kind,
    action: snapshot?.action ?? null,
  };

  return NextResponse.json(result);
}

async function waitForSessionSnapshot(
  sessionId: string,
  runId: string,
  attempts: number,
  delayMs: number
): Promise<AgentRuntimeSessionSnapshot | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const snapshot = await readSessionSnapshot(sessionId);
    if (snapshot && snapshot.runId === runId && !snapshot.pending) {
      return snapshot;
    }
    if (attempt < attempts - 1) {
      await delay(delayMs);
    }
  }

  return null;
}

async function readSessionSnapshot(sessionId: string): Promise<AgentRuntimeSessionSnapshot | null> {
  const response = await fetch(`${controlPlaneBaseUrl()}/query/inspectors/agent_session/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${controlPlaneToken()}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const inspector = (await response.json()) as ControlPlaneInspector;
  return normalizeAgentSession(inspector);
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

  const sessionId = readString(session.id);
  if (!sessionId) return null;

  return {
    sessionId,
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

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? 'Agent runtime request failed.';
  } catch {
    return 'Agent runtime request failed.';
  }
}

function controlPlaneBaseUrl(): string {
  return (process.env.MODES_CONTROL_PLANE_BASE_URL ?? 'http://127.0.0.1:8080').replace(/\/+$/, '');
}

function controlPlaneToken(): string {
  return process.env.MODES_DEV_OPERATOR_TOKEN ?? 'modes-dev-operator';
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
