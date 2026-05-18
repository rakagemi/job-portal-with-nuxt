import type z from "zod"
import type { loginSchema, registerSchema } from "~/features/auth/schemas/auth-schema"

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export interface AuthUser {
    id: string
    name: string
    email: string
    avatar?: string
}

export interface AuthResponse {
    data: {
        accessToken: string
        user: AuthUser
    }
}

export interface ProfileResponse {
    data: AuthUser & {
        createdAt: string
    }
}

export interface RefreshResponse {
    data: {
        accessToken: string
        user: AuthUser
    }
}

export interface LogoutResponse {
    data: {
        message: string
    }
}