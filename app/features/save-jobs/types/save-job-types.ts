import type { JobItem } from '~/common/interface/job-item'

export interface SavedJobsResponse {
  data: JobItem[]
}

export interface SaveJobActionResponse {
  data: {
    message: string
  }
}