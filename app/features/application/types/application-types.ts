import type { JobItem } from '~/common/interface/job-item'

export type ApplicationStatus =
  | 'applied'
  | 'reviewed'
  | 'interview'
  | 'rejected'
  | 'accepted'

export interface ApplicationItem {
  id: string
  status: ApplicationStatus
  appliedAt: string
  job: JobItem
}

export interface ApplicationStatusItem {
  id: string
  status: ApplicationStatus
  appliedAt: string
}

export interface ApplicationsResponse {
  data: ApplicationItem[]
}

export interface ApplicationResponse {
  data: {
    message: string
    application: {
      id: string
      userId: string
      jobId: string
      status: ApplicationStatus
      appliedAt: string
    }
  }
}

export interface JobApplicationStatusResponse {
  data: ApplicationStatusItem | null
}