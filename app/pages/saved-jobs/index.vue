<script setup lang="ts">
import SeoMeta from '~/common/meta/SeoMeta.vue'
import { getApiErrorMessage } from '~/common/types/api-error'
import JobListFull from '~/components/jobs/JobListFull.vue'
import Loading from '~/components/loading/Loading.vue'
import RetryData from '~/components/retry-data/RetryData.vue'
import { useSaveJobs } from '~/features/save-jobs/composables/useSaveJobs'

definePageMeta({
  middleware: 'auth',
})

const { getSavedJobs, unsave } = useSaveJobs()

const { data, status, error, refresh } = await useAsyncData(
  'saved-jobs',
  () => getSavedJobs()
)

const jobs = computed(() => data.value?.data ?? [])
const savedJobIds = computed(() => jobs.value.map(job => job.id))
const isLoading = computed(() => status.value === 'pending')
const appToast = useAppToast()

async function handleToggleSave(jobId: string) {
  try {
    await unsave(jobId)
    appToast.success(
      'Lowongan dihapus dari simpanan',
      'Lowongan ini sudah tidak ada di daftar saved jobs.'
    )
  } catch (error: unknown) {
    appToast.error(
      'Gagal menghapus lowongan',
      getApiErrorMessage(error)
    )
  } finally {
    await refresh()
  }
}

const title = `Saved Jobs | Portal` // You can customize this title as needed
const description = 'Portal 19 juta lapangan pekerjaan.'
</script>

<template>
  <section class="space-y-8">
    <SeoMeta
      :title="title"
      :description="description"
    />
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold text-highlighted">
        Saved Jobs
      </h1>
      <p class="text-sm text-muted">
        Daftar lowongan yang kamu simpan untuk dilihat lagi nanti.
      </p>
    </div>

    <template v-if="isLoading">
      <Loading />
    </template>

    <template v-else-if="error">
      <RetryData
        :error="error"
        @retry="refresh()" />
    </template>

    <template v-else-if="jobs.length">
      <JobListFull
        :jobs="jobs"
        :saved-job-ids="savedJobIds"
        @toggle-save="handleToggleSave"
      />
    </template>

    <template v-else>
      <UCard>
        <div class="flex flex-col items-center gap-3 py-10 text-center">
          <UIcon name="i-lucide-bookmark" class="size-10 text-muted" />
          <div>
            <p class="font-medium text-highlighted">
              Belum ada lowongan tersimpan
            </p>
            <p class="text-sm text-muted">
              Simpan lowongan yang menarik agar mudah ditemukan kembali.
            </p>
          </div>
          <UButton to="/jobs" color="primary">
            Cari lowongan
          </UButton>
        </div>
      </UCard>
    </template>
  </section>
</template>