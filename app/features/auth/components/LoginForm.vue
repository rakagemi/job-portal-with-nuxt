<script setup lang="ts">
const emit = defineEmits<{
  submit: [payload: { email: string; password: string }]
}>()

const state = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)

async function onSubmit() {
  try {
    isSubmitting.value = true
    console.log('child submit fired', state)
    emit('submit', {
      email: state.email,
      password: state.password,
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-md">
    <template #header>
      <div class="space-y-1">
        <h1 class="text-xl font-semibold text-neutral-100">
          Login
        </h1>
        <p class="text-sm text-neutral-500">
          Masuk untuk melihat semua lowongan dan melamar pekerjaan.
        </p>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="nama@email.com"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          name="password"
          autocomplete="current-password"
          placeholder="Masukkan password"
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
          Login
        </UButton>

        <UButton
          type="button"
          color="neutral"
          variant="outline"
          block
        >
          Login dengan Google
        </UButton>
      </div>
    </form>

    <template #footer>
      <p class="text-sm text-slate-600">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="font-medium text-primary">
          Register
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>