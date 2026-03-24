/**
 * Command Client — frontend seam for write/action operations.
 *
 * Currently mocked. When the Rust control plane is ready,
 * replace mock responses with POST /commands/{type} calls.
 *
 * Commands follow the pattern: describe intent → validate → confirm → execute.
 * This client does NOT contain business logic — it relays operator intent.
 */

import type { CreationSession, SessionDeskType, SessionField } from './types';
import { mockSessions } from './mocks';

class CommandClient {
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
