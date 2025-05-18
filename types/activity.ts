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