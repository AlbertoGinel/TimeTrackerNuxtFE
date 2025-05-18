// stores/activities.ts
import { defineStore } from 'pinia'
import type { Activity, ActivityForm } from "~/types/activity"
import { useAuthStore } from './auth'
import { ref } from 'vue'
import { useFetch } from 'nuxt/app'

export const useActivitiesStore = defineStore('activities', () => {
  // State
  const activities = ref<Activity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Helper function to handle errors
  function handleError(err: unknown): string {
    if (err instanceof Error) {
      return err.message
    } else if (typeof err === 'string') {
      return err
    }
    return 'An unknown error occurred'
  }

  // Actions
  async function fetchActivities(apiBaseUrl: string) {
    const authStore = useAuthStore()

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Activity[]>(
        '/activities/',
        {
          baseURL: apiBaseUrl,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          }
        }
      )

      if (fetchError.value) {
        throw fetchError.value
      }

      activities.value = data.value || []
    } catch (err) {
      console.error('Error fetching activities:', err)
      error.value = handleError(err)
    } finally {
      loading.value = false
    }
  }

  async function createActivity(activityData: ActivityForm, apiBaseUrl: string) {
    const authStore = useAuthStore()

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Activity>(
        '/activities/',
        {
          baseURL: apiBaseUrl,
          method: 'POST',
          body: activityData,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (fetchError.value) {
        throw fetchError.value
      }

      if (data.value) {
        activities.value.push(data.value)
      }
      return data.value
    } catch (err) {
      console.error('Error creating activity:', err)
      error.value = handleError(err)
      throw err // Re-throw the error for the calling component to handle if needed
    } finally {
      loading.value = false
    }
  }

  // Expose state and actions
  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity
  }
})