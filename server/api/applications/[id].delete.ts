import { applications } from '~~/server/data/applications'
import { getAuthUser } from '~~/server/utils/get-auth-user'

export default defineEventHandler((event) => {
  const user = getAuthUser(event)
  const jobId = getRouterParam(event, 'id')

  if (!jobId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Job id wajib diisi',
    })
  }

  const index = applications.findIndex(
    item => item.userId === user.id && item.job.id === jobId
  )

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Lamaran tidak ditemukan',
    })
  }

  const deletedApplication = applications[index]

  applications.splice(index, 1)

  return {
    data: {
      message: 'Lamaran berhasil dibatalkan',
      application: deletedApplication,
    },
  }
})