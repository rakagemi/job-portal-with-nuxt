<script setup lang="ts">
defineOptions({
  name: 'AppMeta'
})

interface Props {
  title?: string
  description?: string
  image?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Portal Lowongan Kerja',
  description: 'Temukan pekerjaan remote, hybrid, dan on-site impianmu.',
  image: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png'
})

// useSeoMeta akan secara otomatis mengupdate tag di <head>
useSeoMeta({
  title: () => props.title,
  description: () => props.description,
  ogTitle: () => props.title,
  ogDescription: () => props.description,
  ogImage: () => props.image,
  twitterTitle: () => props.title,
  twitterDescription: () => props.description,
  twitterImage: () => props.image,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <!-- Komponen ini tidak merender apa pun di UI -->
  <span v-if="false" />
</template>