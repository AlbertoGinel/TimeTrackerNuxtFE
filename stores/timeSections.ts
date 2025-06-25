// stores/timeSections.ts
import { defineStore } from 'pinia'
import type { Interval } from '~/types/interval'
import type { Stamp } from '~/types/stamp'
import { useAuthStore } from './auth'
import { ref, readonly } from 'vue'
import { useFetch } from 'nuxt/app'

export const useTimeSectionsStore = defineStore('timeSections', () => {
  // State
  const stamps = ref<Stamp[]>([])
  const intervals = ref<Interval[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentStamp = ref<Stamp | null>(null)
  const currentInterval = ref<Interval | null>(null)

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

  // Core Actions
  async function fetchAll() {
    try {
      loading.value = true
      error.value = null
      await Promise.all([fetchStamps(), fetchIntervals()])
    } catch (err) {
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Stamp Actions
  async function fetchStamps() {
    const authStore = useAuthStore()
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Stamp[]>(
        '/api/stamps/',
        {
          baseURL: apiBaseUrl,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          }
        }
      )

      if (fetchError.value) throw fetchError.value
      stamps.value = data.value || []
    } catch (err) {
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Interval Actions
  async function fetchIntervals() {
    const authStore = useAuthStore()
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Interval[]>(
        '/api/stamps/intervals/',
        {
          baseURL: apiBaseUrl,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          }
        }
      )

      if (fetchError.value) throw fetchError.value
      intervals.value = data.value || []
    } catch (err) {
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Combined Stamp Operations
  async function createStamp(
    stampData: { type: 'start' | 'stop'; activity_id: string | null }
  ): Promise<Stamp | undefined> {
    const authStore = useAuthStore()
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Stamp>(
        '/api/stamps/',
        {
          baseURL: apiBaseUrl,
          method: 'POST',
          body: JSON.stringify(stampData),
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (fetchError.value) throw fetchError.value

      if (data.value) {
        stamps.value.unshift(data.value)
        await fetchIntervals() // Always refresh intervals after stamp changes
        return data.value
      }
    } catch (err) {
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStamp(
    id: string,
    stampData: Partial<{ type: 'start' | 'stop'; activity: string | null }>,
    method: 'PUT' | 'PATCH' = 'PATCH'
  ) {
    const authStore = useAuthStore()
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Stamp>(
        `/stamps/${id}/`,
        {
          baseURL: apiBaseUrl,
          method,
          body: stampData,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (fetchError.value) throw fetchError.value

      if (data.value) {
        const index = stamps.value.findIndex((s: Stamp) => s.id === id)
        if (index !== -1) {
          stamps.value[index] = data.value
        }
        if (currentStamp.value?.id === id) {
          currentStamp.value = data.value
        }
        await fetchIntervals() // Refresh intervals after update
      }
      return data.value
    } catch (err) {
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteStamp(id: string) {
    const authStore = useAuthStore()
    try {
      loading.value = true
      error.value = null

      const { error: fetchError } = await useFetch(
        `/stamps/${id}/`,
        {
          baseURL: apiBaseUrl,
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          }
        }
      )

      if (fetchError.value) throw fetchError.value

      stamps.value = stamps.value.filter((s: Stamp) => s.id !== id)
      if (currentStamp.value?.id === id) {
        currentStamp.value = null
      }
      await fetchIntervals() // Refresh intervals after deletion
    } catch (err) {
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Interval Operations
  async function fetchInterval(id: number) {
    const authStore = useAuthStore()
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Interval>(
        `/api/stamps/intervals/${id}/`,
        {
          baseURL: apiBaseUrl,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          }
        }
      )

      if (fetchError.value) throw fetchError.value
      currentInterval.value = data.value || null
      return data.value
    } catch (err) {
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    stamps: readonly(stamps),
    intervals: readonly(intervals),
    currentStamp: readonly(currentStamp),
    currentInterval: readonly(currentInterval),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    fetchAll,
    fetchStamps,
    fetchIntervals,
    createStamp,
    updateStamp,
    deleteStamp,
    fetchInterval
  }
})