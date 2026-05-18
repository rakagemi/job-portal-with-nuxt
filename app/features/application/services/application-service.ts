import type {
  ApplicationsResponse,
  ApplicationResponse,
  JobApplicationStatusResponse,
} from '~/features/application/types/application-types'

export function createApplicationService(api: typeof $fetch) {
  return {
    getApplications() {
      return api<ApplicationsResponse>('/api/applications')
    },

    getApplicationStatus(jobId: string) {
      return api<JobApplicationStatusResponse>(`/api/jobs/${jobId}/application`)
    },

    apply(jobId: string) {
      return api<ApplicationResponse>(`/api/applications/${jobId}`, {
        method: 'POST',
      })
    },

    withdraw(jobId: string) {
      return api<ApplicationResponse>(`/api/applications/${jobId}`, {
        method: 'DELETE',
      })
    },
  }
}