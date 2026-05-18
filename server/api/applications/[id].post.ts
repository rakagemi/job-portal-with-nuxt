import { applications } from '~~/server/data/applications'
import { jobs } from '~~/server/data/jobs'
import { getAuthUser } from '~~/server/utils/get-auth-user'
import type { JobItem } from '~/common/interface/job-item'

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

  const job = jobs.find(item => item.id === jobId)

  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job Not Found',
      message: 'Lowongan tidak ditemukan',
    })
  }

  const existingApplication = applications.find(
    item => item.userId === user.id && item.job.id === jobId
  )

  if (existingApplication) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict',
      message: 'Kamu sudah pernah melamar lowongan ini',
    })
  }

  const newApplication = {
    id: `application-${applications.length + 1}`,
    userId: user.id,
    status: 'applied' as const,
    appliedAt: new Date().toISOString(),
    job: job as JobItem,
  }

  applications.push(newApplication)

  return {
    data: {
      message: 'Lamaran berhasil dikirim',
      application: newApplication,
    },
  }
})