import { useAuthStore } from "~/stores/auth"

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  if (!auth.accessToken) {
    return navigateTo('/login')
  }
})