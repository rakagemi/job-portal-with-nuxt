<script setup lang="ts">
import { getApiErrorMessage } from '~/common/types/api-error'
import { useApplications } from '~/features/application/composables/useApplications'
import { useSaveJobs } from '~/features/save-jobs/composables/useSaveJobs'
import SeoMeta from '~/common/meta/SeoMeta.vue'
import { useStatusColors } from '~/composables/useStatusColors'
import { useJobs } from '~/features/jobs/composables/useJobs'
import { useAuthStore } from '~/features/auth/stores/auth-store'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const appToast = useAppToast()
const authStore = useAuthStore()

const { getJob } = useJobs()
const { save, unsave, getSavedJobs, isSaving } = useSaveJobs()
const { apply, getApplicationStatus, isApplying } = useApplications()

const jobId = computed(() => String(route.params.id))

const { data, status, error, refresh } = await useAsyncData(
  () => `job-${jobId.value}`,
  () => getJob(jobId.value),
  {
    watch: [jobId],
  }
)

const { data: savedData, refresh: refreshSaved } = await useAsyncData(
  () => `saved-job-${jobId.value}`,
  () => getSavedJobs()
)

const { data: applicationData, refresh: refreshApplication } = await useAsyncData(
  () => `job-application-${jobId.value}`,
  () => getApplicationStatus(jobId.value),
  {
    watch: [jobId],
  }
)

const job = computed(() => data.value?.data)
const isLoading = computed(() => status.value === 'pending')
const savedJobIds = computed(() => savedData.value?.data?.map(item => item.id) ?? [])
const isSaved = computed(() => savedJobIds.value.includes(jobId.value))
const myApplication = computed(() => applicationData.value?.data ?? null)
const hasApplied = computed(() => !!myApplication.value)
const applicationStatus = computed(() => myApplication.value?.status ?? null)

const { getStatusColor } = useStatusColors()
async function handleToggleSave() {
  try {
    if (isSaved.value) {
      await unsave(jobId.value)
      appToast.success(
        'Lowongan dihapus dari simpanan',
        'Lowongan ini sudah tidak ada di daftar saved jobs.'
      )
    } else {
      await save(jobId.value)
      appToast.success(
        'Lowongan tersimpan',
        'Lowongan berhasil ditambahkan ke daftar saved jobs.'
      )
    }

    await refreshSaved()
  } catch (error: unknown) {
    appToast.error(
      'Gagal menyimpan lowongan',
      getApiErrorMessage(error)
    )
  }
}

async function handleApply() {
  try {
    await apply(jobId.value)

      appToast.success(
        'Lamaran berhasil dikirim',
        'Lamaran kamu sudah masuk ke daftar applications.'
      )

    await refreshApplication()
  } catch (error: unknown) {
    appToast.error(
      'Gagal mengirim lamaran',
      getApiErrorMessage(error)
    )
  }
}

const title = `Job Details | Portal` // You can customize this title as needed
const description = 'Portal 19 juta lapangan pekerjaan.'
</script>

<template>
  <section class="mx-auto max-w-3xl space-y-6">
    <SeoMeta
      :title="title"
      :description="description"
    />

    <div class="flex items-center justify-between">
      <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" to="/">
        Kembali
      </UButton>
    </div>

    <template v-if="isLoading">
      <UCard class="p-6">
        <div class="space-y-4">
          <div class="skeleton skeleton-text h-4 w-24" />
          <div class="skeleton skeleton-text h-8 w-72" />
          <div class="skeleton skeleton-text h-4 w-48" />
          <div class="skeleton skeleton-text h-24 w-full" />
        </div>
      </UCard>
    </template>

    <template v-else-if="error">
      <UCard>
        <div class="flex flex-col items-center gap-4 py-8 text-center">
          <UIcon name="i-lucide-circle-alert" class="size-10 text-error" />
          <div>
            <p class="font-medium text-highlighted">
              Gagal memuat detail lowongan
            </p>
            <p class="text-sm text-muted">
              {{ getApiErrorMessage(error) }}
            </p>
          </div>
          <UButton color="neutral" variant="outline" icon="i-lucide-refresh-cw" @click="refresh()">
            Coba lagi
          </UButton>
        </div>
      </UCard>
    </template>

    <template v-else-if="job">
      <UCard class="p-6">
        <div class="space-y-6">
          <div class="space-y-3">
            <div class="flex flex-row justify-between items-center gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                  {{ job.type }}
                </span>
                <span class="text-sm bg-linear-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent">
                  {{ job.location }}
                </span>
              </div>
              <div class="flex items-center justify-end">
              <UBadge
                v-if="applicationStatus"
                :color="getStatusColor(applicationStatus)"
                variant="soft"
              >
                {{ applicationStatus }}
              </UBadge>
              </div>
            </div>

            <div>
              <h1 class="text-2xl font-semibold text-highlighted">
                {{ job.title }}
              </h1>
              <p class="mt-1 text-sm text-toned">
                {{ job.company }}
              </p>
            </div>
          </div>

          <USeparator />

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-default bg-default/60 p-4">
              <p class="text-xs text-muted flex items-center gap-1.5">
                <UIcon name="i-lucide-banknote" class="size-4 text-primary shrink-0" />
                Salary
              </p>
              <p class="mt-1 text-sm font-medium text-highlighted">
                {{ job.salary }}
              </p>
            </div>

            <div class="rounded-xl border border-default bg-default/60 p-4">
              <p class="text-xs text-muted flex items-center gap-1.5">
                <UIcon name="i-lucide-briefcase" class="size-4 text-secondary shrink-0" />
                Job Type
              </p>
              <p class="mt-1 text-sm font-medium text-highlighted">
                {{ job.type }}
              </p>
            </div>
          </div>

          <div>
            <p class="mb-2 text-sm font-medium text-highlighted">
              Skill / Tags
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in job.tags"
                :key="tag"
                class="rounded-full px-2.5 py-1 text-xs"
                :class="{
                    'bg-info/20 text-info': index % 3 === 0,
                    'bg-warning/20 text-warning': index % 3 === 1,
                    'bg-error/20 text-error': index % 3 === 2
                }"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="rounded-xl border border-default bg-default/60 p-4">
            <p class="text-sm font-medium text-highlighted">
              Description
            </p>
            <p class="mt-2 text-sm leading-6 text-toned">
              Posisi {{ job.title }} di {{ job.company }} terbuka untuk kandidat yang memiliki
              ketertarikan pada {{ job.tags.join(', ') }} dan siap bekerja dalam skema {{ job.type.toLowerCase() }} di {{
              job.location }}.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <UButton
              :ui="{ base: 'cursor-pointer' }"
              color="primary"
              :loading="isApplying(jobId)"
              :disabled="hasApplied || isApplying(jobId)"
              :to="authStore.isAuthenticated ? undefined : '/auth/login'"
              @click="authStore.isAuthenticated ? handleApply() : undefined"
            >
              {{ hasApplied ? 'Applied' : 'Apply Now' }}
            </UButton>

            <UButton
              :ui="{ base: 'cursor-pointer' }"
              color="neutral"
              variant="outline"
              :loading="isSaving(jobId)"
              :disabled="isSaving(jobId)"
              @click="handleToggleSave"
            >
              {{ isSaved ? 'Saved' : 'Save' }}
            </UButton>
          </div>
        </div>
      </UCard>
    </template>
  </section>
</template>