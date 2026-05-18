// server/api/jobs/index.get.ts
import { jobs } from '~~/server/data/jobs'

export default defineEventHandler(() => {
  return {
    data: jobs,
  }
})