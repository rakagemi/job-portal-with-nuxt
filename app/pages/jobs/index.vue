<script setup lang="ts">
import { getApiErrorMessage } from '~/common/types/api-error'
import JobListFull from '~/components/jobs/JobListFull.vue'
import { useJobs } from '~/features/jobs/composables/useJobs'
import { useApplications } from '~/features/application/composables/useApplications'
import { useSaveJobs } from '~/features/save-jobs/composables/useSaveJobs'
import type { ApplicationStatus } from '~/features/application/types/application-types'
import Loading from '~/components/loading/Loading.vue'
import RetryData from '~/components/retry-data/RetryData.vue'
import SeoMeta from '~/common/meta/SeoMeta.vue'
import { useAuthStore } from '~/features/auth/stores/auth-store'


definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const { getJobs } = useJobs()
const { getSavedJobs, save, unsave } = useSaveJobs()
const { getApplications, apply, isApplying } = useApplications()

const { data, status, error, refresh } = await useAsyncData(
  'jobs-home',
  () => getJobs()
)

const {
  data: savedData,
  status: savedStatus,
  error: savedError,
  refresh: refreshSaved,
} = await useAsyncData(
  'saved-job-ids',
  () => getSavedJobs()
)

const {
  data: applicationData,
  status: applicationStatus,
  error: applicationError,
  refresh: refreshApplications,
} = await useAsyncData(
  'job-applications',
  () => getApplications()
)

const jobs = computed(() => data.value?.data ?? [])
const savedJobs = computed(() => savedData.value?.data ?? [])
const savedJobIds = computed(() => savedJobs.value.map(job => job.id))
const applications = computed(() => applicationData.value?.data ?? [])
const appliedJobIds = computed(() =>
  applications.value.map(application => application.job.id)
)
const appToast = useAppToast()

const applyingJobIds = computed(() =>
  jobs.value
    .map(job => job.id)
    .filter(jobId => isApplying(jobId))
)

const applicationStatuses = computed(() => {
  return applications.value.reduce<Record<string, ApplicationStatus>>(
    (acc, application) => {
      acc[application.job.id] = application.status
      return acc
    },
    {}
  )
})

const isLoading = computed(() =>
  status.value === 'pending' ||
  savedStatus.value === 'pending' ||
  applicationStatus.value === 'pending'
)

async function handleToggleSave(jobId: string) {
  const isSaved = savedJobIds.value.includes(jobId)

  try {
    if (isSaved) {
      await unsave(jobId)
      appToast.success(
        'Lowongan dihapus dari simpanan',
        'Lowongan ini sudah tidak ada di daftar saved jobs.'
      )
    } else {
      await save(jobId)
      appToast.success(
        'Lowongan tersimpan',
        'Lowongan berhasil ditambahkan ke daftar saved jobs.'
      )
    }
  } catch (error: unknown) {
    appToast.error(
      'Gagal memperbarui simpanan',
      getApiErrorMessage(error)
    )
  } finally {
    await refreshSaved()
  }
}

async function handleApply(jobId: string) {
  try {
    await apply(jobId)
    appToast.success(
      'Lamaran berhasil dikirim',
      'Lowongan berhasil ditambahkan ke daftar applications.'
    )
  } catch (error: unknown) {
    appToast.error(
      'Gagal mengirim lamaran',
      getApiErrorMessage(error)
    )
  } finally {
    await refreshApplications()
  }
}

async function handleRetry() {
  await Promise.all([
    refresh(),
    refreshSaved(),
    refreshApplications(),
  ])
}

const title = `Jobs | Portal`
const description = 'Portal 19 juta lapangan pekerjaan.'
</script>

<template>
  <section class="space-y-8">
    <SeoMeta
      :title="title"
      :description="description"
    />
    <div class="space-y-2">
      <h1 class="text-3xl text-center font-black bg-linear-to-r from-primary to-primary-700 bg-clip-text text-transparent">
        Temukan pekerjaan yang cocok
      </h1>
      <p class="text-sm text-center text-muted">
        Jelajahi lowongan terbaru untuk remote, hybrid, dan on-site.
      </p>
    </div>

    <template v-if="isLoading">
      <Loading />
    </template>

    <template v-else-if="error || savedError || applicationError">
      <RetryData
        :error="error || savedError || applicationError"
        @retry="handleRetry" />
    </template>

    <template v-else>
      <JobListFull
        :jobs="jobs"
        :saved-job-ids="savedJobIds"
        :applied-job-ids="appliedJobIds"
        :applying-job-ids="applyingJobIds"
        :can-apply="authStore.isAuthenticated"
        :application-statuses="applicationStatuses"
        @toggle-save="handleToggleSave"
        @apply="handleApply"
      />
    </template>
  </section>
</template>