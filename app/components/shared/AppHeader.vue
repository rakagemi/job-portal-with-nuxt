<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuthStore } from '~/features/auth/stores/auth-store'
import { useAuth } from '~/features/auth/composables/useAuth'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()

const navigationItems = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      { label: 'Jobs', to: '/jobs' },
      { label: 'Saved Jobs', to: '/saved-jobs' },
      { label: 'Applications', to: '/applications' },
    ]
  }

  return [
    { label: 'Jobs', to: '/' },
    { label: 'Login', to: '/auth/login' },
    { label: 'Register', to: '/auth/register' },
  ]
})

const isActiveNav = (to: string) => {
  if (to === '/jobs') return route.path === '/jobs' || route.path.startsWith('/jobs/')
  return route.path === to
}

const userDisplayName = computed(() => authStore.user?.name || 'User')
const userEmail = computed(() => authStore.user?.email || '')

async function handleLogout() {
  try {
    await logout()
    await navigateTo('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const accountItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: userDisplayName.value,
      avatar: {
        src: authStore.user?.avatar || undefined,
        alt: userDisplayName.value,
      },
      type: 'label',
    },
    {
      label: userEmail.value,
      type: 'label',
      disabled: true,
    },
  ],
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile',
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: handleLogout,
    },
  ],
])
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-default bg-default/75 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink
        :to="authStore.isAuthenticated ? '/jobs' : '/'"
        class="flex items-center gap-3 text-slate-900 transition-opacity hover:opacity-90"
      >
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-primary">
          JP
        </div>

        <div class="flex flex-col leading-none">
          <span class="text-sm font-semibold text-neutral-100">Job Portal</span>
          <span class="text-xs text-neutral-500">Find your next opportunity</span>
        </div>
      </NuxtLink>

      <nav v-if="authStore.isReady" class="hidden items-center gap-2 md:flex">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          :class="isActiveNav(item.to) ? 'bg-slate-100 text-slate-900' : ''"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div v-if="authStore.isReady" class="flex items-center gap-3">
        <template v-if="authStore.isAuthenticated">
          <UDropdownMenu
            :items="accountItems"
            :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
          >
            <UButton color="neutral" variant="outline" class="gap-2">
              <UAvatar
                :src="authStore.user?.avatar || undefined"
                :alt="userDisplayName"
                size="xs"
              />
              <span class="hidden sm:inline">
                Hi, {{ userDisplayName }}
              </span>
              <UIcon name="i-lucide-chevron-down" class="size-4 text-slate-500" />
            </UButton>
          </UDropdownMenu>
        </template>

        <template v-else>
          <UButton color="neutral" variant="ghost" to="/auth/login">
            Login
          </UButton>

          <UButton color="primary" to="/auth/register">
            Register
          </UButton>
        </template>
      </div>
    </div>
  </header>
</template>