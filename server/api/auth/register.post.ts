import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { signAccessToken, signRefreshToken } from '~~/server/utils/jwt'
import { users } from '~~/server/data/users'
import { registerSchema } from '~/features/auth/schemas/auth-schema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)

  const existingUser = users.find(u => u.email === body.email)
  if (existingUser) {
    throw createError({ statusCode: 409, message: 'Email sudah digunakan' })
  }

  const passwordHash = await bcrypt.hash(body.password, 10)

  const newUser = {
    id: randomUUID(),
    name: body.name,
    email: body.email,
    passwordHash,
    avatar: '',
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)

  const payload = { userId: newUser.id, email: newUser.email }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return {
    data: {
      accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    },
  }
})