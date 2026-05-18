<script setup lang="ts">
import SeoMeta from '~/common/meta/SeoMeta.vue'
import { getApiErrorMessage } from '~/common/types/api-error'
import Loading from '~/components/loading/Loading.vue'
import RetryData from '~/components/retry-data/RetryData.vue'
import { useApi } from '~/features/auth/composables/useApi'
import { useAuth } from '~/features/auth/composables/useAuth'

definePageMeta({
  middleware: 'auth',
})

const api = useApi()
const toast = useToast()

const { data: profile, status, error, refresh } = await useAsyncData(
  'profile',
  () => api<{ data: {
    id: string
    name: string
    email: string
    avatar?: string
    createdAt: string
  }}>('/api/auth/profile'),
)

const isLoading = computed(() => status.value === 'pending')

const joinedDate = computed(() => {
  if (!profile.value?.data.createdAt) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(profile.value.data.createdAt))
})

const { logout } = useAuth()

async function handleLogout() {
  try {
    await logout()
    await navigateTo('/')
  } catch (error: unknown) {
    toast.add({
      title: 'Logout gagal',
      description: getApiErrorMessage(error),
      color: 'error',
    })
  }
}

const title = `${profile?.value?.data.name ?? 'Profile'} | Portal` // You can customize this title as needed
const description = 'Portal 19 juta lapangan pekerjaan.'
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <SeoMeta
      :title="title"
      :description="description"
    />
    <!-- Header -->
    <div>
      <h1 class="text-xl font-semibold text-highlighted">
        Profile
      </h1>
      <p class="text-sm text-muted">
        Informasi akun kamu
      </p>
    </div>

    <!-- Loading state -->
    <template v-if="isLoading">
      <Loading />
    </template>

    <!-- Error state -->
    <template v-else-if="error">
      <RetryData
        :error="error"
        @retry="refresh()" />
    </template>

    <!-- Profile content -->
    <template v-else-if="profile">
      <!-- Identity card -->
      <UCard>
        <div class="flex items-center gap-4">
          <UAvatar
            :src="profile.data.avatar || undefined"
            :alt="profile.data.name"
            size="xl"
          />
          <div class="flex-1 min-w-0">
            <p class="text-base font-semibold text-highlighted truncate">
              {{ profile.data.name }}
            </p>
            <p class="text-sm text-muted truncate">
              {{ profile.data.email }}
            </p>
            <p class="text-xs text-muted mt-1">
              Bergabung sejak {{ joinedDate }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Detail info -->
      <UCard>
        <template #header>
          <p class="text-sm font-medium text-highlighted">
            Informasi Akun
          </p>
        </template>

        <dl class="space-y-4">
          <div class="flex items-center justify-between gap-4">
            <dt class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="size-4" />
              Nama lengkap
            </dt>
            <dd class="text-sm font-medium text-highlighted text-right">
              {{ profile.data.name }}
            </dd>
          </div>

          <USeparator />

          <div class="flex items-center justify-between gap-4">
            <dt class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-mail" class="size-4" />
              Email
            </dt>
            <dd class="text-sm font-medium text-highlighted text-right">
              {{ profile.data.email }}
            </dd>
          </div>

          <USeparator />

          <div class="flex items-center justify-between gap-4">
            <dt class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-calendar" class="size-4" />
              Bergabung
            </dt>
            <dd class="text-sm font-medium text-highlighted text-right">
              {{ joinedDate }}
            </dd>
          </div>
        </dl>
      </UCard>

      <!-- Actions -->
      <UCard>
        <template #header>
          <p class="text-sm font-medium text-highlighted">
            Aksi
          </p>
        </template>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-highlighted">
                Saved Jobs
              </p>
              <p class="text-xs text-muted">
                Lihat lowongan yang kamu simpan
              </p>
            </div>
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-bookmark"
              to="/saved-jobs"
            >
              Lihat
            </UButton>
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-highlighted">
                Applications
              </p>
              <p class="text-xs text-muted">
                Riwayat lamaran pekerjaan
              </p>
            </div>
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-file-text"
              to="/applications"
            >
              Lihat
            </UButton>
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-error">
                Logout
              </p>
              <p class="text-xs text-muted">
                Keluar dari akun kamu
              </p>
            </div>
            <UButton
              color="error"
              variant="soft"
              size="sm"
              icon="i-lucide-log-out"
              @click="handleLogout"
            >
              Logout
            </UButton>
          </div>
        </div>
      </UCard>
    </template>
  </div>
</template>