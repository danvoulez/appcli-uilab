// Core domain types for the operator surface frontend.
// These mirror the shapes we expect from the future Rust query API.
// All types here are READ MODEL shapes — what the UI consumes.

export type StatusLevel = 'healthy' | 'warning' | 'degraded' | 'syncing' | 'attention' | 'offline';

export interface StatusLight {
  label: string;
  status: 'on' | 'warn' | 'off';
}

export interface Signal {
  label: string;
  value: string;
  note?: string;
}

export interface Attention {
  title: string;
  body: string;
  severity?: 'warning' | 'critical';
}

export interface ActionItem {
  id: string;
  label: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  href?: string;
  disabled?: boolean;
  requiresConfirm?: boolean;
}

// ─── Place ────────────────────────────────────────────────────────────────

export interface PlaceSummary {
  id: string;
  title: string;
  shortLabel: string;
  descriptor: string;
  shortSummary: string;
  backgroundImage: string;
  accentColor: string;
  textColor: 'light' | 'dark';
  status: StatusLevel;
  statusLights: StatusLight[];
  primarySignals: Signal[];
  attention: Attention | null;
}

export interface PanelItem {
  label: string;
  value?: string;
  status?: 'ok' | 'warn' | 'error' | 'idle';
  note?: string;
}

export interface Panel {
  title: string;
  items: PanelItem[];
}

export interface DetailRow {
  label: string;
  value: string;
  note?: string;
}

export interface DetailSection {
  title: string;
  rows: DetailRow[];
}

export interface Relation {
  place: string;
  placeId?: string;
  nature: string;
}

export interface PlaceDetail extends PlaceSummary {
  overview: string;
  panels: Panel[];
  actions: ActionItem[];
  deepDetails: DetailSection[];
  relations: Relation[];
}

// ─── Inspector ────────────────────────────────────────────────────────────

export type ObjectType = 'entity' | 'project' | 'workflow' | 'job';

export interface InspectorObject {
  id: string;
  type: ObjectType;
  canonicalName: string;
  descriptor?: string;
  status: StatusLevel;
  createdAt: string;
  updatedAt: string;
  ownedBy?: string;
  linkedPlace?: string;
}

export interface EntityInspector extends InspectorObject {
  type: 'entity';
  role: string;
  capabilities: string[];
  credentials: Array<{ label: string; validity: string; status: 'ok' | 'warn' | 'expired' }>;
  trustLinks: Array<{ target: string; mechanism: string }>;
}

export interface ProjectInspector extends InspectorObject {
  type: 'project';
  officialStatus: 'draft' | 'officialized' | 'archived';
  dataSource: string;
  schemaVersion: string;
  rowCount?: number;
  storageUsed?: string;
  migrations: { applied: number; pending: number; lastApplied: string };
}

export interface WorkflowInspector extends InspectorObject {
  type: 'workflow';
  triggerType: 'cron' | 'manual' | 'event' | 'webhook';
  steps: number;
  lastRun?: string;
  lastRunStatus?: StatusLevel;
  inputSource?: string;
  outputTarget?: string;
  publishState: 'draft' | 'published' | 'paused';
}

export interface JobInspector extends InspectorObject {
  type: 'job';
  workflowId?: string;
  workerNode?: string;
  startedAt?: string;
  completedAt?: string;
  exitCode?: number;
  errorMessage?: string;
  inputSummary?: string;
  outputSummary?: string;
}

export type AnyInspector = EntityInspector | ProjectInspector | WorkflowInspector | JobInspector;

// ─── Timeline ─────────────────────────────────────────────────────────────

export type TimelineEventSeverity = 'info' | 'warning' | 'error' | 'success';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorType: 'human' | 'system' | 'agent' | 'worker';
  message: string;
  severity: TimelineEventSeverity;
  linkedObjectId?: string;
  linkedObjectType?: ObjectType;
  linkedObjectLabel?: string;
  metadata?: Record<string, string>;
}

export interface Timeline {
  objectId: string;
  objectType: ObjectType;
  objectLabel: string;
  events: TimelineEvent[];
}

// ─── Logs ─────────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  jobId?: string;
  nodeId?: string;
  traceId?: string;
  metadata?: Record<string, string>;
}

export interface LogView {
  sourceId: string;
  sourceType: 'job' | 'node';
  sourceLabel: string;
  entries: LogEntry[];
  hasMore: boolean;
}

// ─── Creation Sessions ─────────────────────────────────────────────────────

export type SessionDeskType = 'lab-id' | 'supabase' | 'workflows' | 'lab-512';
export type SessionPhase = 'intent' | 'draft' | 'missing-fields' | 'warnings' | 'proposal' | 'confirmation' | 'result';
export type SessionStatus = 'active' | 'waiting' | 'confirmed' | 'completed' | 'failed' | 'cancelled';

export interface SessionField {
  id: string;
  label: string;
  description?: string;
  type: 'text' | 'select' | 'textarea' | 'boolean' | 'date';
  required: boolean;
  value?: string | boolean;
  options?: string[];
  placeholder?: string;
}

export interface SessionWarning {
  id: string;
  severity: 'info' | 'caution' | 'critical';
  title: string;
  body: string;
  canProceed: boolean;
}

export interface SessionProposal {
  summary: string;
  objectType: string;
  objectLabel: string;
  fields: Array<{ label: string; value: string }>;
  estimatedImpact?: string;
}

export interface SessionResult {
  success: boolean;
  objectId?: string;
  objectType?: string;
  objectLabel?: string;
  message: string;
  linkedActions?: ActionItem[];
}

export interface CreationSession {
  id: string;
  deskType: SessionDeskType;
  title: string;
  description: string;
  phase: SessionPhase;
  status: SessionStatus;
  intent: string;
  fields: SessionField[];
  warnings: SessionWarning[];
  proposal: SessionProposal | null;
  result: SessionResult | null;
  createdAt: string;
  updatedAt: string;
}
