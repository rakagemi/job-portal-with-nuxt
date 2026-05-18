<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<{
  submit: [payload: { name: string; email: string; password: string; confirmPassword: string }]
}>()

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

type Schema = z.output<typeof schema>

const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isSubmitting = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isSubmitting.value = true
    emit('submit', event.data)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-md">
    <template #header>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold text-slate-900">
          Register
        </h1>
        <p class="text-sm text-slate-600">
          Buat akun untuk menyimpan lowongan dan melamar pekerjaan.
        </p>
      </div>
    </template>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="Nama lengkap" name="name">
        <UInput
          v-model="state.name"
          placeholder="Nama lengkap"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="nama@email.com"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Minimal 8 karakter"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Konfirmasi password" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="Ulangi password"
          class="w-full"
        />
      </UFormField>

      <div class="space-y-3 pt-2">
        <UButton
          type="submit"
          color="primary"
          block
          :loading="isSubmitting"
        >
          Register
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          block
        >
          Sign up dengan Google
        </UButton>
      </div>
    </UForm>

    <template #footer>
      <p class="text-sm text-slate-600">
        Sudah punya akun?
        <NuxtLink to="/auth/login" class="font-medium text-primary">
          Login
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>