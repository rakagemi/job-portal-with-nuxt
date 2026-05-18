// server/api/save-jobs/[id].post.ts
import { jobs } from '~~/server/data/jobs'
import { savedJobs } from '~~/server/data/save-jobs'
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

  const job = jobs.find(item => item.id === jobId)

  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job Not Found',
      message: 'Lowongan tidak ditemukan',
    })
  }

  const exists = savedJobs.some(
    item => item.userId === user.id && item.jobId === jobId
  )

  if (exists) {
    return {
      data: {
        message: 'Lowongan sudah disimpan',
      },
    }
  }

  savedJobs.push({
    userId: user.id,
    jobId,
    savedAt: new Date().toISOString(),
  })

  return {
    data: {
      message: 'Lowongan berhasil disimpan',
    },
  }
})