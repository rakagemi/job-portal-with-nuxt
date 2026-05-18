import type { SavedJobsResponse, SaveJobActionResponse } from '~/features/save-jobs/types/save-job-types'
import type { useApi } from '~/features/auth/composables/useApi'

type ApiInstance = ReturnType<typeof useApi>

export function createSaveJobService(api: ApiInstance) {
  return {
    getSavedJobs() {
      return api<SavedJobsResponse>('/api/save-jobs')
    },

    saveJob(jobId: string) {
      return api<SaveJobActionResponse>(`/api/save-jobs/${jobId}`, {
        method: 'POST',
      })
    },

    removeSavedJob(jobId: string) {
      return api<SaveJobActionResponse>(`/api/save-jobs/${jobId}`, {
        method: 'DELETE',
      })
    },
  }
}