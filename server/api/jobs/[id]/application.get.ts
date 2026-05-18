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

  const application = applications.find(
    item => item.userId === user.id && item.job.id === jobId
  )

  if (!application) {
    return {
      data: null,
    }
  }

  return {
    data: {
      id: application.id,
      status: application.status,
      appliedAt: application.appliedAt,
    },
  }
})