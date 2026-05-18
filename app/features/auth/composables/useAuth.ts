import { createAuthService } from '~/features/auth/services/auth-service'
import { useAuthStore } from '~/features/auth/stores/auth-store'
import { useApi } from './useApi'

export function useAuth() {
  const api = useApi()
  const authService = createAuthService(api)
  const authStore = useAuthStore()

  async function profile() {
    const res = await authService.profile()
    authStore.setUser(res.data)
    return res.data
  }

  async function login(data: { email: string; password: string }) {
    await authService.login(data)
    await profile()
  }

  async function register(data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) {
    await authService.register(data)
    await profile()
  }

  async function logout(options?: { redirectTo?: string }) {
    try {
      await authService.logout()
    } finally {
      authStore.clearAuth()
      authStore.setReady(true)
    }

    if (options?.redirectTo) {
      await navigateTo(options.redirectTo)
    }
  }

  return {
    login,
    register,
    logout,
    profile,
  }
}