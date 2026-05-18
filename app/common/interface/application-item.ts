import type { JobItem } from "~/common/interface/job-item"

export type ApplicationStatus =
  | 'applied'
  | 'reviewed'
  | 'interview'
  | 'rejected'
  | 'accepted'

export interface ApplicationItem {
    id: string
    userId: string
    status: ApplicationStatus
    appliedAt: string
    job: JobItem
}