<script setup lang="ts">
import { codeStatus } from '~/common/json/http-code-status';
import { getApiErrorMessage, getApiErrorStatus } from '~/common/types/api-error';
import LoginForm from '~/features/auth/components/LoginForm.vue';
import { useAuth } from '~/features/auth/composables/useAuth';

definePageMeta({ middleware: 'guest' })

const { login } = useAuth()
const appToast = useAppToast()

async function handleLogin(payload: { email: string; password: string }) {
  try {
    await login(payload)

    appToast.success(
      'Login berhasil',
      'Selamat datang kembali.'
    )

    await navigateTo('/jobs')
  } catch (error: unknown) {
    const status = getApiErrorStatus(error)

    appToast.error(
      'Login gagal',
      status
        ? (codeStatus[status] ?? getApiErrorMessage(error))
        : getApiErrorMessage(error)
    )
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <section class="w-full max-w-125 mb-8 space-y-4 text-center">
            <Demo
        email="john.doe@example.com"
        password="password123"
      />
    </section>
    <LoginForm @submit="handleLogin" />
  </div>
</template>