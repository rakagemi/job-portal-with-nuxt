<script setup lang="ts">
import { useStatusColors } from '~/composables/useStatusColors'
import SeoMeta from '~/common/meta/SeoMeta.vue'
import { getApiErrorMessage } from '~/common/types/api-error'
import { useApplications } from '~/features/application/composables/useApplications'

definePageMeta({
  middleware: 'auth',
})

const toast = useToast()
const { getApplications, withdraw, isApplying } = useApplications()

const { data, status, error, refresh } = await useAsyncData(
  'applications',
  () => getApplications()
)

const applications = computed(() => data.value?.data ?? [])
const isLoading = computed(() => status.value === 'pending')

const { getStatusColor } = useStatusColors()

async function handleWithdraw(jobId: string) {
  try {
    await withdraw(jobId)

    toast.add({
      title: 'Lamaran dibatalkan',
      description: 'Lamaran berhasil dihapus dari daftar applications.',
      color: 'success',
    })
  } catch (error: unknown) {
    toast.add({
      title: 'Gagal membatalkan lamaran',
      description: getApiErrorMessage(error),
      color: 'error',
    })
  } finally {
    await refresh()
  }
}

const title = `Jobs Tracker | Portal` // You can customize this title as needed
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
        Applications
      </h1>
      <p class="text-sm text-muted">
        Pantau semua lamaran pekerjaan yang sudah kamu kirim.
      </p>
    </div>

    <template v-if="isLoading">
      <div class="grid gap-4 lg:grid-cols-2">
        <UCard v-for="n in 4" :key="n" class="p-5">
          <div class="space-y-4">
            <div class="skeleton skeleton-text h-4 w-24" />
            <div class="skeleton skeleton-text h-5 w-48" />
            <div class="skeleton skeleton-text h-4 w-32" />
            <div class="skeleton skeleton-text h-4 w-40" />
          </div>
        </UCard>
      </div>
    </template>

    <template v-else-if="error">
      <UCard>
        <div class="flex flex-col items-center gap-4 py-8 text-center">
          <UIcon name="i-lucide-circle-alert" class="size-10 text-error" />
          <div>
            <p class="font-medium text-highlighted">
              Gagal memuat applications
            </p>
            <p class="text-sm text-muted">
              {{ getApiErrorMessage(error) }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-refresh-cw"
            @click="refresh()"
          >
            Coba lagi
          </UButton>
        </div>
      </UCard>
    </template>

    <template v-else-if="applications.length">
      <div class="grid gap-4 lg:grid-cols-2">
        <UCard
          v-for="application in applications"
          :key="application.id"
          class="p-5"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-highlighted">
                  {{ application.job.title }}
                </h2>
                <p class="text-sm text-toned">
                  {{ application.job.company }}
                </p>
              </div>

              <UBadge
                :color="getStatusColor(application.status)"
                variant="soft"
              >
                {{ application.status }}
              </UBadge>
            </div>

            <div class="space-y-1 text-sm text-muted">
              <p>{{ application.job.location }}</p>
              <p>{{ application.job.type }}</p>
              <p>Dilamar pada {{ new Date(application.appliedAt).toLocaleDateString('id-ID') }}</p>
            </div>

            <div class="flex items-center gap-3">
              <UButton
                :to="`/jobs/${application.job.id}`"
                color="primary"
                variant="soft"
              >
                Lihat detail
              </UButton>

              <UButton
                color="neutral"
                variant="outline"
                :loading="isApplying(application.job.id)"
                :disabled="isApplying(application.job.id)"
                @click="handleWithdraw(application.job.id)"
              >
                Batalkan lamaran
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </template>

    <template v-else>
      <UCard>
        <div class="flex flex-col items-center gap-3 py-10 text-center">
          <UIcon name="i-lucide-file-text" class="size-10 text-muted" />
          <div>
            <p class="font-medium text-highlighted">
              Belum ada lamaran
            </p>
            <p class="text-sm text-muted">
              Mulai apply ke lowongan yang cocok untuk melihat progres lamaranmu di sini.
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