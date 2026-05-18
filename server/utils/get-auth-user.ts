import type { H3Event } from 'h3'
import { users } from '~~/server/data/users'
import { verifyAccessToken } from '~~/server/utils/jwt'

export function getAuthUser(event: H3Event) {
  const token = getCookie(event, 'access_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Token tidak ditemukan',
    })
  }

  let payload: { userId: string }

  try {
    payload = verifyAccessToken(token) as { userId: string }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Token tidak valid atau sudah kadaluarsa',
    })
  }

  const user = users.find(item => item.id === payload.userId)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User Not Found',
      message: 'User tidak ditemukan',
    })
  }

  return user
}