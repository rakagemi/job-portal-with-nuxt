// common/types/job.types.ts
import type { JobItem } from '~/common/interface/job-item'

export interface JobsResponse {
  data: JobItem[]
}

export interface JobResponse {
  data: JobItem
}