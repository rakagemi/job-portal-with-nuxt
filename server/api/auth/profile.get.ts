import { verifyAccessToken } from '~~/server/utils/jwt'
import { users } from '~~/server/data/users'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Token tidak ditemukan' })
  }

  let payload

  try {
    payload = verifyAccessToken(token)
  } catch {
    throw createError({ statusCode: 401, message: 'Token tidak valid atau sudah kadaluarsa' })
  }

  const user = users.find(u => u.id === payload.userId)
  if (!user) {
    throw createError({ statusCode: 404, message: 'User tidak ditemukan' })
  }

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  }
})