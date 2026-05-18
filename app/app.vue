<script setup>
import SeoMeta from './common/meta/SeoMeta.vue';

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
const title = 'Portal 19 juta | Portal'
const description = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'
</script>

<!-- app.vue -->
<template>
  <UApp>
    <SeoMeta
      :title="title"
      :description="description"
    />
    <NuxtLoadingIndicator color="#2563eb" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>