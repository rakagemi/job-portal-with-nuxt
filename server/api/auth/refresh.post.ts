import { verifyRefreshToken, signAccessToken } from '~~/server/utils/jwt'
import { users } from '~~/server/data/users'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'Refresh token tidak ditemukan' })
  }

  let payload

  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    // Token expired atau invalid → hapus cookie
    deleteCookie(event, 'refresh_token', { path: '/' })
    throw createError({ statusCode: 401, message: 'Refresh token tidak valid atau sudah kadaluarsa' })
  }

  const user = users.find(u => u.id === payload.userId)
  if (!user) {
    throw createError({ statusCode: 404, message: 'User tidak ditemukan' })
  }

  const newAccessToken = signAccessToken({ userId: user.id, email: user.email })

  return {
    data: {
      accessToken: newAccessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    },
  }
})