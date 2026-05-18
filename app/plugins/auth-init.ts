import { useApi } from '~/features/auth/composables/useApi'
import { createAuthService } from '~/features/auth/services/auth-service'
import { useAuthStore } from '~/features/auth/stores/auth-store'

export default defineNuxtPlugin(async () => {
  const api = useApi()
  const authService = createAuthService(api)
  const authStore = useAuthStore()

  if (authStore.isReady) return

  try {
    const res = await authService.profile()
    authStore.setUser(res.data)
  } catch {
    authStore.clearAuth()
  } finally {
    authStore.setReady(true)
  }
})