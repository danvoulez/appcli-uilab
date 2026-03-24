import type { PlaceSummary, PlaceDetail, ActionItem } from '../types';

// ─── Summaries (for the grid / card fronts) ──────────────────────────────

export const mockPlaceSummaries: PlaceSummary[] = [
  {
    id: 'lab-512',
    title: 'LAB 512',
    shortLabel: 'LAB 512',
    descriptor: 'Compute',
    shortSummary: 'Heavy workloads, workers, inference and sustained execution.',
    backgroundImage: '/images/lab-512.jpeg',
    accentColor: '#B5173A',
    textColor: 'light',
    status: 'healthy',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'on' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'Queue depth', value: '3 jobs' },
      { label: 'Workers', value: '4 / 4' },
      { label: 'Last failure', value: '6h ago' },
    ],
    attention: null,
  },
  {
    id: 'lab-8gb',
    title: 'LAB 8GB',
    shortLabel: 'LAB 8GB',
    descriptor: 'Antenna',
    shortSummary: 'Edge runtime, always-on relay, ingress and external presence.',
    backgroundImage: '/images/lab-8gb.png',
    accentColor: '#1D7A3A',
    textColor: 'light',
    status: 'healthy',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'on' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'Heartbeat', value: '12s ago' },
      { label: 'Ingress', value: 'active' },
      { label: 'Relay routes', value: '3 live' },
    ],
    attention: null,
  },
  {
    id: 'lab-256',
    title: 'LAB 256',
    shortLabel: 'LAB 256',
    descriptor: 'Cockpit',
    shortSummary: 'Operator control, development, debug and coordination hub.',
    backgroundImage: '/images/lab-256.png',
    accentColor: '#1B3A5C',
    textColor: 'light',
    status: 'healthy',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'warn' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'Workspace', value: 'appcli-uilab' },
      { label: 'Diverged repos', value: '1' },
      { label: 'Toolchain', value: 'ready' },
    ],
    attention: {
      title: 'Repo divergence',
      body: 'feature/auth-refactor is 14 commits behind main.',
    },
  },
  {
    id: 'supabase',
    title: 'SUPABASE',
    shortLabel: 'SUPABASE',
    descriptor: 'Official',
    shortSummary: 'System of record. Canonical data, realtime, storage and migrations.',
    backgroundImage: '/images/supabase.jpeg',
    accentColor: '#C2611A',
    textColor: 'light',
    status: 'healthy',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'on' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'DB', value: 'available' },
      { label: 'Realtime', value: '2 channels' },
      { label: 'Migrations', value: 'up-to-date' },
    ],
    attention: null,
  },
  {
    id: 'lab-id',
    title: 'LAB ID',
    shortLabel: 'LAB ID',
    descriptor: 'Identity',
    shortSummary: 'Principal registry, credentials, capabilities and trust resolution.',
    backgroundImage: '/images/lab-id.png',
    accentColor: '#1A1A1A',
    textColor: 'light',
    status: 'healthy',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'on' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'Auth health', value: 'nominal' },
      { label: 'Tokens valid', value: '8 / 8' },
      { label: 'Trust graph', value: 'coherent' },
    ],
    attention: null,
  },
  {
    id: 'google-drive',
    title: 'GOOGLE DRIVE',
    shortLabel: 'G. DRIVE',
    descriptor: 'Backup',
    shortSummary: 'Preservation, archives, exported bundles and recovery surfaces.',
    backgroundImage: '/images/google-drive.png',
    accentColor: '#5B2D8E',
    textColor: 'light',
    status: 'syncing',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'on' },
      { label: 'Activity', status: 'warn' },
    ],
    primarySignals: [
      { label: 'Last snapshot', value: '4h ago' },
      { label: 'Completeness', value: '97%' },
      { label: 'Sync', value: 'in progress' },
    ],
    attention: {
      title: 'Incomplete archive',
      body: 'exports/q1-audit bundle is missing 2 assets.',
    },
  },
  {
    id: 'apps',
    title: 'APPS',
    shortLabel: 'APPS',
    descriptor: 'Execution Surface',
    shortSummary: 'Tools, operational apps and launch surfaces for the ecosystem.',
    backgroundImage: '/images/apps.jpeg',
    accentColor: '#B8707A',
    textColor: 'light',
    status: 'healthy',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'on' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'Apps ready', value: '11 / 12' },
      { label: 'Updates pending', value: '2' },
      { label: 'Pinned', value: '6 active' },
    ],
    attention: {
      title: 'App update available',
      body: 'Supabase Studio 2.14.0 and Docker 26.1.1 pending.',
    },
  },
  {
    id: 'workflows',
    title: 'WORK FLOWS',
    shortLabel: 'FLOWS',
    descriptor: 'Orchestration',
    shortSummary: 'Active flows, automations, pipelines and coordinated handoffs.',
    backgroundImage: '/images/workflows.jpeg',
    accentColor: '#4A7FAA',
    textColor: 'light',
    status: 'warning',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'warn' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'Active runs', value: '4' },
      { label: 'Failed steps', value: '1' },
      { label: 'Pending approvals', value: '2' },
    ],
    attention: {
      title: 'Failed step requires review',
      body: 'nightly-export/step-3 (transform) failed.',
    },
  },
  {
    id: 'settings',
    title: 'SETTINGS',
    shortLabel: 'SETTINGS',
    descriptor: 'Policy',
    shortSummary: 'System-wide policies, thresholds, flags and integration bindings.',
    backgroundImage: '/images/settings.jpeg',
    accentColor: '#5A8A65',
    textColor: 'light',
    status: 'healthy',
    statusLights: [
      { label: 'Connectivity', status: 'on' },
      { label: 'Integrity', status: 'on' },
      { label: 'Activity', status: 'on' },
    ],
    primarySignals: [
      { label: 'Config drift', value: 'none' },
      { label: 'Integrations', value: '5 / 5' },
      { label: 'Last change', value: '2d ago' },
    ],
    attention: null,
  },
];

// ─── Helper objects defined first to avoid TDZ ───────────────────────────

const overviews: Record<string, string> = {
  'lab-512': 'Compute is stable. All workers responding. Queue processing at expected throughput. No retry pressure detected.',
  'lab-8gb': 'Edge is breathing normally. Ingress accepting requests. All relay routes active. Heartbeat within bounds.',
  'lab-256': 'Cockpit operational. Operator workspace active. One repo needs attention. All toolchain checks passing.',
  supabase: 'All canonical surfaces healthy. No schema drift detected. Realtime subscriptions active. Storage within policy.',
  'lab-id': 'All principals resolved. Credentials current and valid. Trust graph intact. No pending anomalies.',
  'google-drive': 'Backup largely complete. Current nightly sync running. One archive bundle flagged as incomplete.',
  apps: 'Most tools ready. 11 of 12 apps healthy. 2 updates pending — no critical impact.',
  workflows: 'Flows mostly healthy but one run has a failed step blocking downstream. 2 approvals waiting.',
  settings: 'Configuration coherent across all environments. No drift detected. All integrations responding.',
};

const panels: Record<string, PlaceDetail['panels']> = {
  'lab-512': [
    {
      title: 'Worker Pool',
      items: [
        { label: 'worker-01', value: 'active', status: 'ok' },
        { label: 'worker-02', value: 'active', status: 'ok' },
        { label: 'worker-03', value: 'active', status: 'ok' },
        { label: 'worker-04', value: 'idle', status: 'idle' },
      ],
    },
    {
      title: 'Job Queue',
      items: [
        { label: 'inference/batch-114', value: 'running', status: 'ok', note: '1m 24s' },
        { label: 'export/nightly-pdf', value: 'queued', status: 'idle' },
        { label: 'sync/supabase-push', value: 'queued', status: 'idle' },
      ],
    },
  ],
  'lab-8gb': [
    {
      title: 'Ingress Endpoints',
      items: [
        { label: '/api/ingest', value: 'up', status: 'ok', note: '23 req/min' },
        { label: '/api/webhook', value: 'up', status: 'ok', note: '4 req/min' },
        { label: '/health', value: 'up', status: 'ok' },
      ],
    },
    {
      title: 'Relay Routes',
      items: [
        { label: '→ LAB 512 jobs', value: 'active', status: 'ok' },
        { label: '→ SUPABASE events', value: 'active', status: 'ok' },
        { label: '→ LAB 256 logs', value: 'active', status: 'ok' },
      ],
    },
  ],
  'lab-256': [
    {
      title: 'Repos in Focus',
      items: [
        { label: 'appcli-uilab', value: 'clean', status: 'ok', note: 'main' },
        { label: 'feature/auth-refactor', value: 'diverged', status: 'warn', note: '14 behind' },
        { label: 'lab-infra', value: 'clean', status: 'ok' },
      ],
    },
    {
      title: 'Active Tools',
      items: [
        { label: 'Claude Code', value: 'running', status: 'ok' },
        { label: 'Docker Desktop', value: 'running', status: 'ok' },
        { label: 'Supabase CLI', value: 'idle', status: 'idle' },
      ],
    },
  ],
  supabase: [
    {
      title: 'Canonical Data',
      items: [
        { label: 'postgres', value: 'healthy', status: 'ok', note: '14.1ms avg' },
        { label: 'Row count (main)', value: '84,312 rows', status: 'ok' },
        { label: 'Last write', value: '2m ago', status: 'ok' },
      ],
    },
    {
      title: 'Realtime Channels',
      items: [
        { label: 'presence:ops', value: 'active · 2 subs', status: 'ok' },
        { label: 'broadcast:events', value: 'active · 0 subs', status: 'idle' },
      ],
    },
  ],
  'lab-id': [
    {
      title: 'Principals',
      items: [
        { label: 'human:operator', value: 'active', status: 'ok' },
        { label: 'machine:lab-512', value: 'active', status: 'ok' },
        { label: 'machine:lab-8gb', value: 'active', status: 'ok' },
        { label: 'agent:claude-code', value: 'active', status: 'ok' },
      ],
    },
    {
      title: 'Credentials',
      items: [
        { label: 'SUPABASE service key', value: 'valid · 88d left', status: 'ok' },
        { label: 'GitHub PAT', value: 'valid · 22d left', status: 'warn' },
        { label: 'Anthropic API key', value: 'valid', status: 'ok' },
      ],
    },
  ],
  'google-drive': [
    {
      title: 'Snapshots',
      items: [
        { label: 'supabase-daily-2025-03-23', value: 'complete', status: 'ok', note: '1.2 GB' },
        { label: 'supabase-daily-2025-03-22', value: 'complete', status: 'ok', note: '1.1 GB' },
      ],
    },
    {
      title: 'Preserved Bundles',
      items: [
        { label: 'exports/q4-2024', value: 'complete', status: 'ok' },
        { label: 'exports/q1-audit', value: 'incomplete', status: 'warn', note: '2 assets missing' },
      ],
    },
  ],
  apps: [
    {
      title: 'Pinned Apps',
      items: [
        { label: 'Claude Code', value: 'ready', status: 'ok', note: 'v1.2.4' },
        { label: 'Supabase Studio', value: 'update avail', status: 'warn', note: 'v2.14.0' },
        { label: 'Docker Desktop', value: 'update avail', status: 'warn', note: 'v26.1.1' },
        { label: 'Cursor', value: 'ready', status: 'ok', note: 'v0.42' },
      ],
    },
  ],
  workflows: [
    {
      title: 'Current Runs',
      items: [
        { label: 'nightly-export', value: 'blocked', status: 'error', note: 'step 3 failed' },
        { label: 'realtime-sync', value: 'running', status: 'ok', note: '1m 12s' },
        { label: 'report-gen-weekly', value: 'running', status: 'ok' },
        { label: 'lab-health-check', value: 'running', status: 'ok' },
      ],
    },
    {
      title: 'Approval Queue',
      items: [
        { label: 'schema-migration v48', value: 'waiting · operator', status: 'warn' },
        { label: 'credential-rotation', value: 'waiting · operator', status: 'warn' },
      ],
    },
  ],
  settings: [
    {
      title: 'Integrations',
      items: [
        { label: 'GitHub', value: 'connected', status: 'ok' },
        { label: 'Supabase', value: 'connected', status: 'ok' },
        { label: 'Anthropic API', value: 'connected', status: 'ok' },
        { label: 'Google OAuth', value: 'connected', status: 'ok' },
        { label: 'Google Drive API', value: 'connected', status: 'ok' },
      ],
    },
    {
      title: 'Feature Flags',
      items: [
        { label: 'realtime_presence', value: 'enabled', status: 'ok' },
        { label: 'auto_backup', value: 'enabled', status: 'ok' },
        { label: 'agent_autonomy', value: 'disabled', status: 'idle' },
      ],
    },
  ],
};

const actions: Record<string, ActionItem[]> = {
  'lab-512': [
    { id: 'inspect-workers', label: 'Inspect workers', variant: 'primary', href: '/inspectors/jobs/job-001' },
    { id: 'retry-failed', label: 'Retry failed jobs', variant: 'secondary' },
    { id: 'drain-node', label: 'Drain node', variant: 'danger', requiresConfirm: true },
    { id: 'open-logs', label: 'Open execution logs', variant: 'secondary', href: '/log-views/jobs/job-001' },
    { id: 'submit-job', label: 'Submit job', variant: 'primary', href: '/creation-sessions/new?desk=lab-512' },
  ],
  'lab-8gb': [
    { id: 'test-relay', label: 'Test relay', variant: 'primary' },
    { id: 'inspect-ingress', label: 'Inspect ingress', variant: 'secondary' },
    { id: 'restart-edge', label: 'Restart edge service', variant: 'danger', requiresConfirm: true },
    { id: 'view-events', label: 'View network events', variant: 'secondary', href: '/log-views/nodes/node-8gb' },
  ],
  'lab-256': [
    { id: 'debug-console', label: 'Open debug console', variant: 'primary' },
    { id: 'inspect-repo', label: 'Inspect active repo', variant: 'secondary' },
    { id: 'open-logs', label: 'Open recent logs', variant: 'secondary', href: '/log-views/nodes/node-256' },
    { id: 'setup-verify', label: 'Run setup verification', variant: 'secondary' },
  ],
  supabase: [
    { id: 'inspect-schema', label: 'Inspect schema', variant: 'primary', href: '/inspectors/projects/proj-001' },
    { id: 'verify-realtime', label: 'Verify realtime', variant: 'secondary' },
    { id: 'review-storage', label: 'Review storage', variant: 'secondary' },
    { id: 'officialize', label: 'Officialize project', variant: 'primary', href: '/creation-sessions/new?desk=supabase' },
  ],
  'lab-id': [
    { id: 'inspect-creds', label: 'Inspect credentials', variant: 'primary' },
    { id: 'verify-principal', label: 'Verify principal', variant: 'secondary', href: '/inspectors/entities/entity-001' },
    { id: 'rotate-key', label: 'Rotate key', variant: 'danger', requiresConfirm: true },
    { id: 'register-entity', label: 'Register entity', variant: 'primary', href: '/creation-sessions/new?desk=lab-id' },
  ],
  'google-drive': [
    { id: 'inspect-backups', label: 'Inspect backups', variant: 'primary' },
    { id: 'export-state', label: 'Export current state', variant: 'secondary' },
    { id: 'verify-archive', label: 'Verify archive', variant: 'secondary' },
    { id: 'open-bundle', label: 'Open preserved bundle', variant: 'secondary' },
  ],
  apps: [
    { id: 'launch-tool', label: 'Launch tool', variant: 'primary' },
    { id: 'pin-app', label: 'Pin app', variant: 'secondary' },
    { id: 'inspect-health', label: 'Inspect app health', variant: 'secondary' },
    { id: 'review-updates', label: 'Review updates', variant: 'secondary' },
  ],
  workflows: [
    { id: 'inspect-run', label: 'Inspect run', variant: 'primary', href: '/inspectors/workflows/wf-001' },
    { id: 'retry-step', label: 'Retry failed step', variant: 'secondary' },
    { id: 'pause-auto', label: 'Pause automation', variant: 'danger', requiresConfirm: true },
    { id: 'create-flow', label: 'Create workflow', variant: 'primary', href: '/creation-sessions/new?desk=workflows' },
  ],
  settings: [
    { id: 'review-integrations', label: 'Review integrations', variant: 'primary' },
    { id: 'toggle-flag', label: 'Toggle feature flag', variant: 'secondary' },
    { id: 'inspect-thresholds', label: 'Inspect thresholds', variant: 'secondary' },
    { id: 'compare-env', label: 'Compare environments', variant: 'secondary' },
  ],
};

const deepDetails: Record<string, PlaceDetail['deepDetails']> = {
  'lab-512': [
    {
      title: 'Runtime Envelope',
      rows: [
        { label: 'CPU load', value: '41%', note: 'nominal' },
        { label: 'Memory', value: '6.1 GB / 8 GB' },
        { label: 'Thermal', value: '62°C', note: 'within bounds' },
        { label: 'Uptime', value: '14d 6h' },
      ],
    },
    {
      title: 'Retry Policy',
      rows: [
        { label: 'Max retries', value: '3' },
        { label: 'Backoff', value: 'exponential · 2× base' },
        { label: 'Dead-letter', value: 'enabled → SUPABASE' },
      ],
    },
  ],
  'lab-id': [
    {
      title: 'Rotation Schedule',
      rows: [
        { label: 'GitHub PAT', value: 'due in 22d', note: 'action needed' },
        { label: 'Supabase key', value: 'due in 88d' },
        { label: 'Last rotation', value: '4d ago', note: 'Anthropic key' },
      ],
    },
    {
      title: 'Trust Bindings',
      rows: [
        { label: 'lab-512 → supabase', value: 'via service key' },
        { label: 'lab-8gb → lab-id', value: 'via mTLS' },
        { label: 'operator → all', value: 'via session token' },
      ],
    },
  ],
  supabase: [
    {
      title: 'Migration Posture',
      rows: [
        { label: 'Applied', value: '47 migrations' },
        { label: 'Pending', value: 'none' },
        { label: 'Last applied', value: '3d ago' },
        { label: 'Schema hash', value: 'a3f1b9c2', note: 'verified' },
      ],
    },
  ],
  workflows: [
    {
      title: 'Failure Detail',
      rows: [
        { label: 'Flow', value: 'nightly-export' },
        { label: 'Step', value: '3 / 7 (transform)' },
        { label: 'Error', value: 'schema mismatch: col missing' },
        { label: 'Last success', value: '2d ago' },
      ],
    },
  ],
  settings: [
    {
      title: 'Change History',
      rows: [
        { label: '2d ago', value: 'Disabled agent_autonomy flag' },
        { label: '4d ago', value: 'Updated CPU alert threshold to 85%' },
        { label: '8d ago', value: 'Added Google Drive API integration' },
      ],
    },
  ],
};

const relations: Record<string, PlaceDetail['relations']> = {
  'lab-512': [
    { place: 'LAB 8GB', placeId: 'lab-8gb', nature: 'ingress relay' },
    { place: 'SUPABASE', placeId: 'supabase', nature: 'output sink' },
    { place: 'LAB ID', placeId: 'lab-id', nature: 'credential resolution' },
  ],
  'lab-8gb': [
    { place: 'LAB 512', placeId: 'lab-512', nature: 'compute relay target' },
    { place: 'SUPABASE', placeId: 'supabase', nature: 'event forwarding' },
    { place: 'LAB ID', placeId: 'lab-id', nature: 'trust verification' },
  ],
  'lab-256': [
    { place: 'LAB 512', placeId: 'lab-512', nature: 'log inspection' },
    { place: 'LAB 8GB', placeId: 'lab-8gb', nature: 'network debug' },
    { place: 'SUPABASE', placeId: 'supabase', nature: 'migration ops' },
  ],
  supabase: [
    { place: 'LAB 512', placeId: 'lab-512', nature: 'job output sink' },
    { place: 'GOOGLE DRIVE', placeId: 'google-drive', nature: 'backup export' },
    { place: 'WORK FLOWS', placeId: 'workflows', nature: 'canonical source' },
  ],
  'lab-id': [
    { place: 'LAB 512', placeId: 'lab-512', nature: 'credential issuer' },
    { place: 'LAB 8GB', placeId: 'lab-8gb', nature: 'trust anchor' },
    { place: 'SETTINGS', placeId: 'settings', nature: 'policy enforcement' },
  ],
  'google-drive': [
    { place: 'SUPABASE', placeId: 'supabase', nature: 'snapshot source' },
    { place: 'WORK FLOWS', placeId: 'workflows', nature: 'export trigger' },
    { place: 'SETTINGS', placeId: 'settings', nature: 'retention policy' },
  ],
  apps: [
    { place: 'LAB 256', placeId: 'lab-256', nature: 'launch context' },
    { place: 'LAB ID', placeId: 'lab-id', nature: 'credential binding' },
    { place: 'SETTINGS', placeId: 'settings', nature: 'version policy' },
  ],
  workflows: [
    { place: 'SUPABASE', placeId: 'supabase', nature: 'data source' },
    { place: 'GOOGLE DRIVE', placeId: 'google-drive', nature: 'export target' },
    { place: 'LAB ID', placeId: 'lab-id', nature: 'approval authority' },
  ],
  settings: [
    { place: 'LAB ID', placeId: 'lab-id', nature: 'policy enforcement' },
    { place: 'WORK FLOWS', placeId: 'workflows', nature: 'flag consumption' },
    { place: 'GOOGLE DRIVE', placeId: 'google-drive', nature: 'retention policy' },
  ],
};

// ─── Full Details (defined after helpers to avoid TDZ) ────────────────────

export const mockPlaceDetails: PlaceDetail[] = mockPlaceSummaries.map((s) => ({
  ...s,
  overview: overviews[s.id] ?? '',
  panels: panels[s.id] ?? [],
  actions: actions[s.id] ?? [],
  deepDetails: deepDetails[s.id] ?? [],
  relations: relations[s.id] ?? [],
}));
