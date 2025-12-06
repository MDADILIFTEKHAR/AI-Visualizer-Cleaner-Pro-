
export interface DataRow {
  [key: string]: any;
}

export interface ColumnProfile {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'mixed';
  missingCount: number;
  uniqueCount: number;
  sample: any[];
  isGeo?: boolean;
}

export interface DataIssue {
  id: string;
  type: 'missing' | 'duplicate' | 'outlier' | 'format';
  severity: 'low' | 'medium' | 'high';
  description: string;
  column?: string;
  affectedRows: number[]; // Indices
}

export interface DataSet {
  name: string;
  rows: DataRow[];
  columns: string[];
  profile: ColumnProfile[];
  issues: DataIssue[];
}

export interface PivotConfig {
  rows: string[];
  columns: string[];
  values: { field: string; agg: 'sum' | 'avg' | 'count' | 'min' | 'max' }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
}

export enum AppView {
  UPLOAD = 'UPLOAD',
  CLEAN = 'CLEAN',
  PIVOT = 'PIVOT',
  VISUALIZE = 'VISUALIZE',
  MAP = 'MAP',
  API = 'API',
  PRICING = 'PRICING'
}