// stores/stamps.ts
import { defineStore } from 'pinia'
import type { Stamp } from '~/types/stamp'
import { useAuthStore } from './auth'
import { ref } from 'vue'
import { useFetch } from 'nuxt/app'

export const useStampsStore = defineStore('stamps', () => {
  // State
  const stamps = ref<Stamp[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentStamp = ref<Stamp | null>(null)

  // Get API base URL from environment variables
  console.log('here we go pro: ', process.env.NUXT_PUBLIC_API_BASE_URL)
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
  async function fetchStamps() {
    const authStore = useAuthStore()

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Stamp[]>(
        '/api/stamps/',
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

      stamps.value = data.value || []
    } catch (err) {
      console.error('Error fetching stamps:', err)
      error.value = handleError(err)
    } finally {
      loading.value = false
    }
  }

  async function createStamp(
    stampData: { type: 'start' | 'stop'; activity_id: string }
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

      if (fetchError.value) {
        throw fetchError.value
      }

      if (data.value) {
        stamps.value.unshift(data.value)
        return data.value
      }
    } catch (err) {
      console.error('Error creating stamp:', err)
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStamp(id: number) {
    const authStore = useAuthStore()

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await useFetch<Stamp>(
        `/stamps/${id}/`,
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

      currentStamp.value = data.value || null
      return data.value
    } catch (err) {
      console.error('Error fetching stamp:', err)
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStamp(
    id: number,
    stampData: Partial<{ type: 'start' | 'stop'; activity: string }>,
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

      if (fetchError.value) {
        throw fetchError.value
      }

      if (data.value) {
        const index = stamps.value.findIndex(s => s.id === id)
        if (index !== -1) {
          stamps.value[index] = data.value
        }
        if (currentStamp.value?.id === id) {
          currentStamp.value = data.value
        }
      }
      return data.value
    } catch (err) {
      console.error('Error updating stamp:', err)
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteStamp(id: number) {
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

      if (fetchError.value) {
        throw fetchError.value
      }

      stamps.value = stamps.value.filter(s => s.id !== id)
      if (currentStamp.value?.id === id) {
        currentStamp.value = null
      }
    } catch (err) {
      console.error('Error deleting stamp:', err)
      error.value = handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    stamps,
    currentStamp,
    loading,
    error,
    fetchStamps,
    createStamp,
    fetchStamp,
    updateStamp,
    deleteStamp
  }
})