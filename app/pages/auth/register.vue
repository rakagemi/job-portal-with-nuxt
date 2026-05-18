<script setup lang="ts">
import { codeStatus } from '~/common/json/http-code-status'
import { getApiErrorMessage, getApiErrorStatus } from '~/common/types/api-error'
import RegisterForm from '~/features/auth/components/RegisterForm.vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import type { RegisterInput } from '~/features/auth/types/auth-type'

definePageMeta({
  middleware: 'guest',
})

const { register } = useAuth()
const appToast = useAppToast()

async function handleRegister(payload: RegisterInput) {
  try {
    await register(payload)

    appToast.success(
      'Register berhasil',
      'Akun kamu sudah dibuat.'
    )

    await navigateTo('/')
  } catch (error: unknown) {
    const status = getApiErrorStatus(error)

    appToast.error(
      'Register gagal',
      status
        ? (codeStatus[status] ?? getApiErrorMessage(error))
        : getApiErrorMessage(error)
    )
  }
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-8rem)] items-center justify-center">
    <RegisterForm @submit="handleRegister" />
  </div>
</template>