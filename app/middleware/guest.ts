import { useAuthStore } from '~/features/auth/stores/auth-store'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.isReady) {
    return
  }

  if (authStore.isAuthenticated) {
    return navigateTo('/jobs')
  }
})