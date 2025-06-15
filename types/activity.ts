import type { Stamp } from "./stamp"

// types/activity.ts
export interface Activity {
  id: string
  name: string
  color: string
  icon: string
  points_per_hour: number
  seconds_free: number
  created_at: string
  user?: string
}

export interface ActivityForm {
  name: string
  color: string
  icon: string
  points_per_hour: number
  seconds_free: number
}

//Expanded Ideas

export interface ExpandedActivity extends Omit<Activity, 'user'> {
  user: {
    id: number;
    username: string;
    // Add other user fields as needed (email, etc.)
  };
  // Could add computed fields if needed
  total_points?: number;
  total_time_spent?: number;
}

export interface ActivityForm {
  name: string;
  color: string;
  icon: string;
  points_per_hour: number;
  seconds_free: number;
  // user is excluded since it comes from auth context
}

// For API responses that might include related stamps
export interface ActivityWithStamps extends ExpandedActivity {
  stamps: Stamp[]; // Using your previously defined Stamp interface
}

// For the create/update payload (excludes server-generated fields)
export type ActivityPayload = Omit<Activity,
  'id' | 'created_at' | 'updated_at' | 'user'
>;