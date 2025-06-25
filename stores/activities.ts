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

  // Get API base URL from environment variables
  const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

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
  async function fetchActivities() {  // Removed apiBaseUrl parameter
    const authStore = useAuthStore()

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Activity[]>(
        '/api/activities/',
        {
          baseURL: apiBaseUrl,  // Using the store's apiBaseUrl
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

  async function createActivity(activityData: ActivityForm) {  // Removed apiBaseUrl parameter
    const authStore = useAuthStore()

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Activity>(
        '/api/activities/',
        {
          baseURL: apiBaseUrl,  // Using the store's apiBaseUrl
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
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity
  }
})