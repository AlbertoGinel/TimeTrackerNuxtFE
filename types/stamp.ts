import type { Activity } from './activity';

export type Stamp = {
  id: string;
  timestamp: string;
  user: number;
} & (
    | {
      type: 'start';
      activity: Activity;
    }
    | {
      type: 'stop';
      activity: Activity | null;
    }
  );