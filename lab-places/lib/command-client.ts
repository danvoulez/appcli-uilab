/**
 * Command Client — frontend seam for write/action operations.
 *
 * Currently mocked. When the Rust control plane is ready,
 * replace mock responses with POST /commands/{type} calls.
 *
 * Commands follow the pattern: describe intent → validate → confirm → execute.
 * This client does NOT contain business logic — it relays operator intent.
 */

import type { AttachedFile, CreationSession, SessionDeskType, SessionField } from './types';
import { mockSessions } from './mocks';

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
    await delay(700 + Math.random() * 500);
    // Mock: the response is handled locally in AgentChat via respond().
    // Production: const fd = new FormData();
    //             fd.append('text', text);
    //             for (const a of attachments) {
    //               const blob = await fetch(a.objectUrl!).then(r => r.blob());
    //               fd.append('files', blob, a.name);
    //             }
    //             return fetch(`/api/places/${placeId}/agent/messages`, { method: 'POST', body: fd }).then(r => r.json());
    console.log(`[CommandClient] sendChatMessage place=${placeId} files=${attachments.length}`);
  }

  // ─── Creation Sessions ────────────────────────────────────────────────────

  async startSession(
    deskType: SessionDeskType,
    intent: string
  ): Promise<{ sessionId: string }> {
    await delay(200);
    // In production: POST /creation-sessions { deskType, intent }
    const id = `session-${Date.now()}`;
    return { sessionId: id };
  }

  async updateSessionFields(
    sessionId: string,
    fields: SessionField[]
  ): Promise<CreationSession> {
    await delay(150);
    // In production: PATCH /creation-sessions/{id}/fields
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    return { ...session, fields, phase: 'warnings', updatedAt: new Date().toISOString() };
  }

  async confirmSession(sessionId: string): Promise<CreationSession> {
    await delay(300);
    // In production: POST /creation-sessions/{id}/confirm
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    return {
      ...session,
      phase: 'result',
      status: 'completed',
      result: {
        success: true,
        objectId: `obj-${Date.now()}`,
        objectType: session.deskType,
        objectLabel: session.proposal?.objectLabel ?? 'Unknown',
        message: 'Object created and registered successfully.',
      },
      updatedAt: new Date().toISOString(),
    };
  }

  async cancelSession(sessionId: string): Promise<void> {
    await delay(100);
    // In production: POST /creation-sessions/{id}/cancel
  }

  // ─── Job Actions ──────────────────────────────────────────────────────────

  async retryJob(jobId: string): Promise<void> {
    await delay(200);
    // In production: POST /jobs/{id}/retry
    console.log(`[CommandClient] retry job ${jobId}`);
  }

  async cancelJob(jobId: string): Promise<void> {
    await delay(150);
    // In production: POST /jobs/{id}/cancel
    console.log(`[CommandClient] cancel job ${jobId}`);
  }

  // ─── Workflow Actions ─────────────────────────────────────────────────────

  async pauseWorkflow(workflowId: string): Promise<void> {
    await delay(150);
    // In production: POST /workflows/{id}/pause
    console.log(`[CommandClient] pause workflow ${workflowId}`);
  }

  async retryWorkflowStep(workflowId: string, stepIndex: number): Promise<void> {
    await delay(200);
    // In production: POST /workflows/{id}/steps/{step}/retry
    console.log(`[CommandClient] retry step ${stepIndex} on workflow ${workflowId}`);
  }

  // ─── Key Rotation ─────────────────────────────────────────────────────────

  async rotateCredential(credentialId: string): Promise<void> {
    await delay(300);
    // In production: POST /credentials/{id}/rotate
    console.log(`[CommandClient] rotate credential ${credentialId}`);
  }
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export const commandClient = new CommandClient();
