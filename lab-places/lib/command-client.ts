/**
 * Command Client — frontend seam for write/action operations.
 *
 * Until the command boundary is live, this client returns explicit SOON failures
 * instead of pretending to mutate canonical state locally.
 */

import type { AttachedFile, CreationSession, SessionDeskType, SessionField } from './types';

class CommandClient {
  // ─── Agent chat ───────────────────────────────────────────────────────────

  /**
   * Send a chat message (with optional file attachments) to the place agent.
   *
   * In production: POST /places/{placeId}/agent/messages
   *   multipart/form-data: text (string) + raw File bytes
   *   Response: { text: string; files?: AttachedFile[] }
   *
   * To wire a real backend, replace the local respond() call in AgentChat
   * with an await of this method, and build a FormData from the raw File
   * objects (obtainable via fetch(attachment.objectUrl) → blob).
   */
  async sendChatMessage(
    placeId: string,
    text: string,
    attachments: AttachedFile[]
  ): Promise<void> {
    await delay(150);
    throw new Error(
      `SOON: agent command boundary not wired yet for ${placeId}. Refusing fake local write with ${attachments.length} attachments.`
    );
  }

  // ─── Creation Sessions ────────────────────────────────────────────────────

  async startSession(
    deskType: SessionDeskType,
    intent: string
  ): Promise<{ sessionId: string }> {
    await delay(100);
    throw new Error(
      `SOON: creation session open boundary is not wired yet for ${deskType}. Refusing fake session start for intent "${intent}".`
    );
  }

  async updateSessionFields(
    sessionId: string,
    fields: SessionField[]
  ): Promise<CreationSession> {
    await delay(100);
    throw new Error(
      `SOON: creation session continue boundary is not wired yet for ${sessionId}. Refusing fake field update with ${fields.length} field(s).`
    );
  }

  async confirmSession(sessionId: string): Promise<CreationSession> {
    await delay(100);
    throw new Error(`SOON: creation session confirm boundary is not wired yet for ${sessionId}.`);
  }

  async cancelSession(sessionId: string): Promise<void> {
    await delay(50);
    throw new Error(`SOON: session cancellation is not wired yet for ${sessionId}.`);
  }

  // ─── Job Actions ──────────────────────────────────────────────────────────

  async retryJob(jobId: string): Promise<void> {
    await delay(50);
    throw new Error(`SOON: retry command boundary is not wired yet for ${jobId}.`);
  }

  async cancelJob(jobId: string): Promise<void> {
    await delay(50);
    throw new Error(`SOON: cancel command boundary is not wired yet for ${jobId}.`);
  }

  // ─── Workflow Actions ─────────────────────────────────────────────────────

  async pauseWorkflow(workflowId: string): Promise<void> {
    await delay(50);
    throw new Error(`SOON: pause workflow boundary is not wired yet for ${workflowId}.`);
  }

  async retryWorkflowStep(workflowId: string, stepIndex: number): Promise<void> {
    await delay(50);
    throw new Error(`SOON: retry workflow step boundary is not wired yet for ${workflowId}#${stepIndex}.`);
  }

  // ─── Key Rotation ─────────────────────────────────────────────────────────

  async rotateCredential(credentialId: string): Promise<void> {
    await delay(50);
    throw new Error(`SOON: credential rotation boundary is not wired yet for ${credentialId}.`);
  }
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export const commandClient = new CommandClient();
