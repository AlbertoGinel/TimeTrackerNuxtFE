// types/interval.ts
import type { Activity } from './activity';

type UUID = string;  // Helper type for UUID strings

export interface Interval {
  opening_stamp: UUID;
  closing_stamp: UUID | null;
  user: number;
  activity: Activity;
  fromDate: string;
  toDate: string | null;
  duration: string;
  is_open: boolean;
}

// Utility type for creating new intervals (omits calculated fields)
export type CreateIntervalDto = Pick<Interval, 'opening_stamp' | 'closing_stamp'>;

// Type for open intervals
export interface OpenInterval extends Omit<Interval, 'closing_stamp' | 'toDate' | 'is_open'> {
  is_open: true;
  closing_stamp: null;
  toDate: null;
}