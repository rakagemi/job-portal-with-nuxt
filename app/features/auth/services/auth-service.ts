import type {
  AuthResponse,
  LoginInput,
  LogoutResponse,
  ProfileResponse,
  RefreshResponse,
  RegisterInput,
} from '~/features/auth/types/auth-type'
import type { useApi } from '../composables/useApi'

type ApiInstance = ReturnType<typeof useApi>

export function createAuthService(api: ApiInstance) {
  return {
    login(data: LoginInput): Promise<AuthResponse> {
      return api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: data,
      })
    },

    register(data: RegisterInput): Promise<AuthResponse> {
      return api<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: data,
      })
    },

    logout(): Promise<LogoutResponse> {
      return api<LogoutResponse>('/api/auth/logout', {
        method: 'POST',
      })
    },

    profile(): Promise<ProfileResponse> {
      return api<ProfileResponse>('/api/auth/profile')
    },

    refresh(): Promise<RefreshResponse> {
      return api<RefreshResponse>('/api/auth/refresh', {
        method: 'POST',
      })
    },
  }
}