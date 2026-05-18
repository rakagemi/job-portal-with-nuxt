import { createApplicationService } from '~/features/application/services/application-service'
import { useApi } from '~/features/auth/composables/useApi'

export function useApplications() {
  const api = useApi()
  const applicationService = createApplicationService(api)

  const pendingIds = useState<string[]>('application-pending-ids', () => [])

  function startPending(jobId: string) {
    if (!pendingIds.value.includes(jobId)) {
      pendingIds.value.push(jobId)
    }
  }

  function finishPending(jobId: string) {
    pendingIds.value = pendingIds.value.filter(id => id !== jobId)
  }

  function isApplying(jobId: string) {
    return pendingIds.value.includes(jobId)
  }

  async function getApplications() {
    return applicationService.getApplications()
  }

  async function getApplicationStatus(jobId: string) {
    return applicationService.getApplicationStatus(jobId)
  }

  async function apply(jobId: string) {
    startPending(jobId)

    try {
      return await applicationService.apply(jobId)
    } finally {
      finishPending(jobId)
    }
  }

  async function withdraw(jobId: string) {
    startPending(jobId)

    try {
      return await applicationService.withdraw(jobId)
    } finally {
      finishPending(jobId)
    }
  }

  return {
    getApplications,
    getApplicationStatus,
    apply,
    withdraw,
    isApplying,
  }
}