export type StatusLevel = 'healthy' | 'warning' | 'degraded' | 'syncing' | 'attention';

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
}

export interface ActionItem {
  label: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'danger';
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
  nature: string;
}

export interface PlaceData {
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
  // Back face
  overview: string;
  panels: Panel[];
  actions: ActionItem[];
  deepDetails: DetailSection[];
  relations: Relation[];
}
