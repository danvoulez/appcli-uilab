export interface AgentRuntimeAction {
  actionKind: string;
  targetPlace: string;
  status: string;
}

export interface AgentRuntimeTurnResult {
  sessionId: string;
  runId: string;
  pending: boolean;
  sessionStatus: string;
  acknowledgement: string;
  replyText?: string;
  outputKind?: string;
  action?: AgentRuntimeAction | null;
}

export interface AgentRuntimeSessionSnapshot {
  sessionId: string;
  sessionStatus: string;
  runId?: string;
  runStatus?: string;
  outputKind?: string;
  replyText?: string;
  action?: AgentRuntimeAction | null;
  updatedAt?: string;
  pending: boolean;
}

export function isTerminalRunStatus(status?: string | null): boolean {
  return status === 'completed' || status === 'failed';
}
