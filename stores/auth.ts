// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useFetch, useRuntimeConfig } from 'nuxt/app'

interface User {
  username: string | null
}

interface TokenResponse {
  access: string
  refresh: string
}

interface LoginCredentials {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken: Ref<string | null> = ref(null)
  const refreshToken: Ref<string | null> = ref(null)
  const user: Ref<User> = ref({
    username: null
  })

  const config = useRuntimeConfig()
  const apiBaseUrl = computed(() => config.public.apiBaseUrl)



  async function login(credentials: LoginCredentials) {
    try {
      const { data, error } = await useFetch<TokenResponse>('/api/token/', {
        baseURL: config.public.apiBaseUrl as string,
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (error.value) {
        throw error.value
      }

      if (data.value) {
        accessToken.value = data.value.access
        refreshToken.value = data.value.refresh
        user.value.username = credentials.username
      }

      return true
    } catch (error) {
      logout()
      throw new Error('Login failed', { cause: error })
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value.username = null
  }

  return {
    accessToken,
    refreshToken,
    user,
    login,
    logout
  }
}, {
  //persist: true
})