import type { Activity } from './activity';

export interface Stamp {
  id: number;
  type: 'start' | 'stop';
  timestamp: string; // ISO 8601 format datetime string
  activity: Activity; // Now contains full object
  user: number; // User ID
}
