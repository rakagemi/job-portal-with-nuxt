import { jobs } from '~~/server/data/jobs'
import { savedJobs } from '~~/server/data/save-jobs'
import { getAuthUser } from '~~/server/utils/get-auth-user'

export default defineEventHandler((event) => {
  const user = getAuthUser(event)

  const userSavedJobs = savedJobs
    .filter(item => item.userId === user.id)
    .map(item => {
      const job = jobs.find(jobItem => jobItem.id === item.jobId)
      return job
    })
    .filter(Boolean)

  return {
    data: userSavedJobs,
  }
})