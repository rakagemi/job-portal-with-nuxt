// server/api/save-jobs/[id].delete.ts
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

  const index = savedJobs.findIndex(
    item => item.userId === user.id && item.jobId === jobId
  )

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Lowongan tersimpan tidak ditemukan',
    })
  }

  savedJobs.splice(index, 1)

  return {
    data: {
      message: 'Lowongan berhasil dihapus dari simpanan',
    },
  }
})