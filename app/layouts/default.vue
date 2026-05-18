<script setup lang="ts">
import AppHeader from '~/components/shared/AppHeader.vue';

</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100">
    <AppHeader />

    <main class="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>