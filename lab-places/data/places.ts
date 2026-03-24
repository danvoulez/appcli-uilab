import { PlaceData } from '@/types/place';

export const places: PlaceData[] = [
  // ROW 1
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
      { label: 'Active workers', value: '4 / 4' },
      { label: 'Last failure', value: '6h ago' },
    ],
    attention: null,
    overview:
      'Compute is stable. All workers responding. Queue is processing at expected throughput. No retry pressure detected.',
    panels: [
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
      {
        title: 'Failed / Retried',
        items: [
          { label: 'inference/batch-108', value: '2 retries', status: 'warn', note: 'resolved' },
        ],
      },
    ],
    actions: [
      { label: 'Inspect workers', variant: 'primary' },
      { label: 'Retry failed jobs', variant: 'secondary' },
      { label: 'Drain node', variant: 'danger' },
      { label: 'Open execution logs', variant: 'secondary' },
    ],
    deepDetails: [
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
      {
        title: 'Relations',
        rows: [
          { label: 'Ingress from', value: 'LAB 8GB relay' },
          { label: 'Outputs to', value: 'SUPABASE canonical' },
          { label: 'Credentials via', value: 'LAB ID' },
        ],
      },
    ],
    relations: [
      { place: 'LAB 8GB', nature: 'ingress relay' },
      { place: 'SUPABASE', nature: 'output sink' },
      { place: 'LAB ID', nature: 'credential resolution' },
    ],
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
    overview:
      'Edge is breathing normally. Ingress accepting requests. All relay routes active. Heartbeat within bounds.',
    panels: [
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
      {
        title: 'Lightweight Services',
        items: [
          { label: 'cache-proxy', value: 'running', status: 'ok' },
          { label: 'rate-limiter', value: 'running', status: 'ok' },
          { label: 'tls-terminator', value: 'running', status: 'ok' },
        ],
      },
    ],
    actions: [
      { label: 'Test relay', variant: 'primary' },
      { label: 'Inspect ingress', variant: 'secondary' },
      { label: 'Restart edge service', variant: 'danger' },
      { label: 'View network events', variant: 'secondary' },
    ],
    deepDetails: [
      {
        title: 'Connectivity History',
        rows: [
          { label: 'Last outage', value: '8d ago', note: '3 min' },
          { label: 'Avg response', value: '18ms' },
          { label: 'TLS cert', value: 'valid · 82d left' },
        ],
      },
      {
        title: 'Failover',
        rows: [
          { label: 'Failover target', value: 'LAB 256 local proxy' },
          { label: 'Auto-switch', value: 'enabled · 30s threshold' },
          { label: 'Last test', value: '3d ago · passed' },
        ],
      },
    ],
    relations: [
      { place: 'LAB 512', nature: 'compute relay target' },
      { place: 'SUPABASE', nature: 'event forwarding' },
      { place: 'LAB ID', nature: 'trust verification' },
    ],
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
      { label: 'Active workspace', value: 'appcli-uilab' },
      { label: 'Repos diverged', value: '1 branch' },
      { label: 'Toolchain', value: 'ready' },
    ],
    attention: {
      title: 'Repo divergence',
      body: 'feature/auth-refactor is 14 commits behind main. Review or rebase.',
    },
    overview:
      'Cockpit is operational. Operator workspace active. One repo needs attention. All toolchain checks passing.',
    panels: [
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
      {
        title: 'Log Streams',
        items: [
          { label: 'lab-512 worker logs', value: 'tailing', status: 'ok' },
          { label: 'edge access log', value: 'paused', status: 'idle' },
        ],
      },
    ],
    actions: [
      { label: 'Open debug console', variant: 'primary' },
      { label: 'Inspect active repo', variant: 'secondary' },
      { label: 'Open recent logs', variant: 'secondary' },
      { label: 'Run setup verification', variant: 'secondary' },
    ],
    deepDetails: [
      {
        title: 'Environment',
        rows: [
          { label: 'Node', value: '20.11.0' },
          { label: 'Python', value: '3.12.2' },
          { label: 'Docker', value: '26.1.0' },
          { label: 'Shell', value: 'zsh 5.9' },
        ],
      },
      {
        title: 'Last Debug Sessions',
        rows: [
          { label: 'lab-512 timeout', value: '2h ago', note: 'resolved' },
          { label: 'supabase migration', value: 'yesterday', note: 'resolved' },
        ],
      },
    ],
    relations: [
      { place: 'LAB 512', nature: 'log inspection' },
      { place: 'LAB 8GB', nature: 'network debug' },
      { place: 'SUPABASE', nature: 'migration ops' },
    ],
  },

  // ROW 2
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
      { label: 'Migration', value: 'up-to-date' },
    ],
    attention: null,
    overview:
      'All canonical surfaces healthy. No schema drift detected. Realtime subscriptions active. Storage within policy.',
    panels: [
      {
        title: 'Canonical Data',
        items: [
          { label: 'postgres', value: 'healthy', status: 'ok', note: '14.1 ms avg' },
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
      {
        title: 'Storage',
        items: [
          { label: 'artifacts bucket', value: '2.3 GB / 10 GB', status: 'ok' },
          { label: 'exports bucket', value: '890 MB / 10 GB', status: 'ok' },
        ],
      },
    ],
    actions: [
      { label: 'Inspect schema', variant: 'primary' },
      { label: 'Verify realtime', variant: 'secondary' },
      { label: 'Review storage', variant: 'secondary' },
      { label: 'Check migrations', variant: 'secondary' },
    ],
    deepDetails: [
      {
        title: 'Migration Posture',
        rows: [
          { label: 'Applied', value: '47 migrations' },
          { label: 'Pending', value: 'none' },
          { label: 'Last applied', value: '3d ago' },
          { label: 'Schema hash', value: 'a3f1b9c2', note: 'verified' },
        ],
      },
      {
        title: 'Integrity Notes',
        rows: [
          { label: 'Foreign keys', value: 'all valid' },
          { label: 'RLS policies', value: '12 active' },
          { label: 'Backups', value: 'daily → Google Drive' },
        ],
      },
    ],
    relations: [
      { place: 'LAB 512', nature: 'job output sink' },
      { place: 'GOOGLE DRIVE', nature: 'backup export target' },
      { place: 'WORK FLOWS', nature: 'canonical source for flows' },
    ],
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
    overview:
      'All principals resolved. Credentials current and valid. Trust graph intact. No pending anomalies.',
    panels: [
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
          { label: 'Google OAuth', value: 'valid', status: 'ok' },
        ],
      },
      {
        title: 'Capability Map',
        items: [
          { label: 'compute:invoke', value: 'granted → lab-512', status: 'ok' },
          { label: 'storage:write', value: 'granted → supabase', status: 'ok' },
          { label: 'edge:relay', value: 'granted → lab-8gb', status: 'ok' },
        ],
      },
    ],
    actions: [
      { label: 'Inspect credentials', variant: 'primary' },
      { label: 'Verify principal', variant: 'secondary' },
      { label: 'Rotate key', variant: 'danger' },
      { label: 'Review capabilities', variant: 'secondary' },
    ],
    deepDetails: [
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
    relations: [
      { place: 'LAB 512', nature: 'credential issuer' },
      { place: 'LAB 8GB', nature: 'trust anchor' },
      { place: 'SETTINGS', nature: 'policy enforcement' },
    ],
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
      { label: 'Archive completeness', value: '97%' },
      { label: 'Sync', value: 'in progress' },
    ],
    attention: {
      title: 'Incomplete archive',
      body: 'exports/q1-audit bundle is missing 2 assets. Verify export completeness.',
    },
    overview:
      'Backup is largely complete. Current nightly sync running. One archive bundle flagged as incomplete.',
    panels: [
      {
        title: 'Snapshots',
        items: [
          { label: 'supabase-daily-2025-03-23', value: 'complete', status: 'ok', note: '1.2 GB' },
          { label: 'supabase-daily-2025-03-22', value: 'complete', status: 'ok', note: '1.1 GB' },
          { label: 'supabase-weekly-2025-03-17', value: 'complete', status: 'ok', note: '1.4 GB' },
        ],
      },
      {
        title: 'Preserved Bundles',
        items: [
          { label: 'exports/q4-2024', value: 'complete', status: 'ok' },
          { label: 'exports/q1-audit', value: 'incomplete', status: 'warn', note: '2 assets missing' },
          { label: 'code/infra-archive-v2', value: 'complete', status: 'ok' },
        ],
      },
      {
        title: 'Draft Archives',
        items: [
          { label: 'drafts/design-tokens', value: '14 files', status: 'ok' },
          { label: 'drafts/ops-runbooks', value: '6 files', status: 'ok' },
        ],
      },
    ],
    actions: [
      { label: 'Inspect backups', variant: 'primary' },
      { label: 'Export current state', variant: 'secondary' },
      { label: 'Verify archive', variant: 'secondary' },
      { label: 'Open preserved bundle', variant: 'secondary' },
    ],
    deepDetails: [
      {
        title: 'Retention Policy',
        rows: [
          { label: 'Daily snapshots', value: '14d retention' },
          { label: 'Weekly snapshots', value: '6 months retention' },
          { label: 'Bundles', value: 'indefinite' },
        ],
      },
      {
        title: 'Recovery Confidence',
        rows: [
          { label: 'Last restore test', value: '11d ago', note: 'passed' },
          { label: 'RTO estimate', value: '~35 min' },
          { label: 'RPO target', value: '24h', note: 'met' },
        ],
      },
    ],
    relations: [
      { place: 'SUPABASE', nature: 'snapshot source' },
      { place: 'WORK FLOWS', nature: 'export trigger' },
      { place: 'SETTINGS', nature: 'retention policy' },
    ],
  },

  // ROW 3
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
      { label: 'Updates pending', value: '2 apps' },
      { label: 'Pinned tools', value: '6 active' },
    ],
    attention: {
      title: 'App update available',
      body: 'Supabase Studio 2.14.0 and Docker 26.1.1 have pending updates.',
    },
    overview:
      'Most tools are ready. 11 of 12 apps healthy. 2 updates pending — no critical impact. Pinned surfaces accessible.',
    panels: [
      {
        title: 'Pinned Apps',
        items: [
          { label: 'Claude Code', value: 'ready', status: 'ok', note: 'v1.2.4' },
          { label: 'Supabase Studio', value: 'update avail', status: 'warn', note: 'v2.14.0' },
          { label: 'Docker Desktop', value: 'update avail', status: 'warn', note: 'v26.1.1' },
          { label: 'Cursor', value: 'ready', status: 'ok', note: 'v0.42' },
          { label: 'Warp', value: 'ready', status: 'ok' },
          { label: 'Proxyman', value: 'ready', status: 'ok' },
        ],
      },
      {
        title: 'Recent Tools',
        items: [
          { label: 'pgAdmin', value: 'last used 2h ago', status: 'ok' },
          { label: 'Insomnia', value: 'last used yesterday', status: 'ok' },
          { label: 'Simulator', value: 'last used 3d ago', status: 'idle' },
        ],
      },
    ],
    actions: [
      { label: 'Launch tool', variant: 'primary' },
      { label: 'Pin app', variant: 'secondary' },
      { label: 'Inspect app health', variant: 'secondary' },
      { label: 'Review updates', variant: 'secondary' },
    ],
    deepDetails: [
      {
        title: 'Version State',
        rows: [
          { label: 'Supabase Studio', value: '2.13.1 → 2.14.0', note: 'update ready' },
          { label: 'Docker Desktop', value: '26.1.0 → 26.1.1', note: 'patch' },
          { label: 'All others', value: 'current' },
        ],
      },
      {
        title: 'Dependency Notes',
        rows: [
          { label: 'Node 20', value: 'required by 4 apps' },
          { label: 'Python 3.12', value: 'required by 2 apps' },
          { label: 'Docker socket', value: 'required by 3 apps' },
        ],
      },
    ],
    relations: [
      { place: 'LAB 256', nature: 'launch context' },
      { place: 'LAB ID', nature: 'credential binding' },
      { place: 'SETTINGS', nature: 'version policy' },
    ],
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
      body: 'nightly-export/step-3 (transform) failed with a schema mismatch. Needs manual resolution.',
    },
    overview:
      'Flows are mostly healthy but one run has a failed step blocking downstream. 2 approvals waiting.',
    panels: [
      {
        title: 'Current Runs',
        items: [
          { label: 'nightly-export', value: 'blocked', status: 'error', note: 'step 3 failed' },
          { label: 'realtime-sync', value: 'running', status: 'ok', note: '1m 12s' },
          { label: 'report-gen-weekly', value: 'running', status: 'ok', note: '4m 03s' },
          { label: 'lab-health-check', value: 'running', status: 'ok', note: '22s' },
        ],
      },
      {
        title: 'Approval Queue',
        items: [
          { label: 'schema-migration v48', value: 'waiting · operator', status: 'warn' },
          { label: 'credential-rotation', value: 'waiting · operator', status: 'warn' },
        ],
      },
      {
        title: 'Flow Templates',
        items: [
          { label: 'nightly-export', value: '7 steps', status: 'ok' },
          { label: 'realtime-sync', value: '3 steps', status: 'ok' },
          { label: 'report-gen-weekly', value: '5 steps', status: 'ok' },
        ],
      },
    ],
    actions: [
      { label: 'Inspect run', variant: 'primary' },
      { label: 'Retry failed step', variant: 'secondary' },
      { label: 'Pause automation', variant: 'danger' },
      { label: 'Create branch flow', variant: 'secondary' },
    ],
    deepDetails: [
      {
        title: 'Failure Detail',
        rows: [
          { label: 'Flow', value: 'nightly-export' },
          { label: 'Step', value: '3 / 7 (transform)' },
          { label: 'Error', value: 'schema mismatch: col missing' },
          { label: 'Last success', value: '2d ago' },
        ],
      },
      {
        title: 'Execution Lineage',
        rows: [
          { label: 'Triggered by', value: 'cron · 02:00 UTC' },
          { label: 'Input source', value: 'SUPABASE canonical' },
          { label: 'Output target', value: 'GOOGLE DRIVE exports' },
        ],
      },
    ],
    relations: [
      { place: 'SUPABASE', nature: 'data source' },
      { place: 'GOOGLE DRIVE', nature: 'export target' },
      { place: 'LAB ID', nature: 'approval authority' },
    ],
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
      { label: 'Integrations', value: '5 / 5 healthy' },
      { label: 'Last change', value: '2d ago' },
    ],
    attention: null,
    overview:
      'Configuration is coherent across all environments. No drift detected. All integrations responding.',
    panels: [
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
          { label: 'debug_verbose', value: 'disabled', status: 'idle' },
        ],
      },
      {
        title: 'Thresholds',
        items: [
          { label: 'CPU alert', value: '> 85%', status: 'ok' },
          { label: 'Queue backlog alert', value: '> 20 jobs', status: 'ok' },
          { label: 'Backup age alert', value: '> 26h', status: 'ok' },
        ],
      },
    ],
    actions: [
      { label: 'Review integrations', variant: 'primary' },
      { label: 'Toggle feature', variant: 'secondary' },
      { label: 'Inspect thresholds', variant: 'secondary' },
      { label: 'Compare environment config', variant: 'secondary' },
    ],
    deepDetails: [
      {
        title: 'Change History',
        rows: [
          { label: '2d ago', value: 'Disabled agent_autonomy flag' },
          { label: '4d ago', value: 'Updated CPU alert threshold to 85%' },
          { label: '8d ago', value: 'Added Google Drive API integration' },
        ],
      },
      {
        title: 'Environment Config',
        rows: [
          { label: 'Production', value: 'lab-512 · lab-8gb · supabase' },
          { label: 'Development', value: 'lab-256 · local supabase' },
          { label: 'Drift status', value: 'none detected' },
        ],
      },
    ],
    relations: [
      { place: 'LAB ID', nature: 'policy enforcement' },
      { place: 'WORK FLOWS', nature: 'flag consumption' },
      { place: 'GOOGLE DRIVE', nature: 'retention policy' },
    ],
  },
];
