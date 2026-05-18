
import type { JobApplicationStatusResponse } from '~/features/application/types/application-types'
import type { useApi } from '~/features/auth/composables/useApi'
import type { JobsResponse, JobResponse } from '~/features/jobs/types/job-types'

type ApiInstance = ReturnType<typeof useApi>

export function createJobService(api: ApiInstance) {
  return {
    getJobs() {
      return api<JobsResponse>('/api/jobs')
    },

    getJob(jobId: string) {
      return api<JobResponse>(`/api/jobs/${jobId}`)
    },

    getJobApplication(jobId: string) {
      return api<JobApplicationStatusResponse>(`/api/jobs/${jobId}/application`)
    },
  }
}