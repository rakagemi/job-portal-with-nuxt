import { defineStore } from 'pinia'
import type { AuthUser } from '~/features/auth/types/auth-type'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isReady = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  function setUser(userData: AuthUser | null) {
    user.value = userData
  }

  function clearAuth() {
    user.value = null
  }

  function setReady(value: boolean) {
    isReady.value = value
  }

  return {
    user,
    isReady,
    isAuthenticated,
    setUser,
    clearAuth,
    setReady,
  }
})