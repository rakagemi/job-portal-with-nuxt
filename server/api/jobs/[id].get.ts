// server/api/jobs/[id].get.ts
import { jobs } from '~~/server/data/jobs'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  const job = jobs.find(item => item.id === id)

  if (!job) {
    throw createError({
      statusCode: 404,
      message: 'Lowongan tidak ditemukan',
    })
  }

  return {
    data: job,
  }
})