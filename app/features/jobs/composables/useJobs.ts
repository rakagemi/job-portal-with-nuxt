import { useApi } from '~/features/auth/composables/useApi'
import { createJobService } from '../services/job-service'

export function useJobs() {
  const api = useApi()
  const jobService = createJobService(api)

  async function getJobs() {
    return await jobService.getJobs()
  }

  async function getJob(jobId: string) {
    return await jobService.getJob(jobId)
  }

  async function getJobApplication(jobId: string) {
    return await jobService.getJobApplication(jobId)
  }

  return {
    getJobs,
    getJob,
    getJobApplication,
  }
}