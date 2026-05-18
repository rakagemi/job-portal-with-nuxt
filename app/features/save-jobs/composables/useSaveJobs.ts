import { useApi } from '~/features/auth/composables/useApi'
import { createSaveJobService } from '~/features/save-jobs/services/save-job-service'

export function useSaveJobs() {
  const api = useApi()
  const saveJobService = createSaveJobService(api)

  const savingIds = ref<string[]>([])

  const isSaving = (jobId: string) => savingIds.value.includes(jobId)

  async function save(jobId: string) {
    if (isSaving(jobId)) return
    savingIds.value.push(jobId)

    try {
      await saveJobService.saveJob(jobId)
    } finally {
      savingIds.value = savingIds.value.filter(id => id !== jobId)
    }
  }

  async function unsave(jobId: string) {
    if (isSaving(jobId)) return
    savingIds.value.push(jobId)

    try {
      await saveJobService.removeSavedJob(jobId)
    } finally {
      savingIds.value = savingIds.value.filter(id => id !== jobId)
    }
  }

  async function getSavedJobs() {
    return await saveJobService.getSavedJobs()
  }

  return {
    save,
    unsave,
    getSavedJobs,
    isSaving,
  }
}