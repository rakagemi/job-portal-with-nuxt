import { useAuthStore } from "~/features/auth/stores/auth-store"

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  let isHandlingUnauthorized = false

  const api = $fetch.create({
    credentials: 'include',

    onRequest({ options }) {
      if (import.meta.server) {
        const cookie = useRequestHeaders(['cookie']).cookie
        if (cookie) {
          const currentHeaders = new Headers(options.headers || {})
          currentHeaders.set('cookie', cookie)
          options.headers = currentHeaders
        }
      }
    },

    async onResponseError({ request, response }) {
      if (response.status !== 401) return

      const requestUrl = String(request)
      const ignoredApiRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/logout',
        '/api/auth/refresh',
        '/api/auth/profile',
      ]

      const shouldIgnoreRequest = ignoredApiRoutes.some(route =>
        requestUrl.includes(route)
      )

      if (shouldIgnoreRequest || isHandlingUnauthorized) return

      isHandlingUnauthorized = true

      try {
        const authStore = useAuthStore()
        authStore.clearAuth()
        authStore.setReady(true)

        const currentPath = router.currentRoute.value.path
        const isAuthPage = currentPath.startsWith('/auth')

        if (!isAuthPage) {
          await nuxtApp.runWithContext(() => navigateTo('/auth/login'))
        }
      } finally {
        isHandlingUnauthorized = false
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})