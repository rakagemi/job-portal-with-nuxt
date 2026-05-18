import type { ApplicationStatus } from '~/features/application/types/application-types'

export const useStatusColors = () => {
  function getStatusColor(status: ApplicationStatus) {
    switch (status) {
      case 'accepted':
        return 'success'
      case 'interview':
        return 'info'
      case 'reviewed':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'neutral'
    }
  }

  return {
    getStatusColor
  }
}