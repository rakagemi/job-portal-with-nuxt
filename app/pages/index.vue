<script setup lang="ts">
  import JobListPreview from '~/components/jobs/JobListPreview.vue'
  import Loading from '~/components/loading/Loading.vue'
  import { useJobs } from '~/features/jobs/composables/useJobs'
  import { h, computed } from 'vue'
import Demo from '~/components/demo/Demo.vue'

  definePageMeta({
    middleware: 'guest',
  })

  const JobsHero = () => {
  return h('div', { class: 'space-y-2' }, [
    h('h1', { class: 'text-2xl md:text-5xl text-center font-black tracking-tighter leading-tight bg-linear-to-r from-[#42d392] to-[#647eff] bg-clip-text text-transparent' }, [
      '19 Juta Lapangan Pekerjaan ',
      h('span', {
        class: 'font-black text-highlighted'
      }, '#Tersedia')
    ]),
    h('p', { class: 'text-sm text-center text-muted' },
      'Jelajahi lowongan terbaru untuk remote, hybrid, dan on-site.'
    )
  ])
}

  const { getJobs } = useJobs()

  const { data, status, error, refresh } = await useAsyncData(
    'jobs-home',
    () => getJobs()
  )

  const jobs = computed(() => data.value?.data ?? [])
  const isLoading = computed(() => status.value === 'pending')
  </script>

<template>
  <section class="space-y-8">
    <JobsHero />

    <template v-if="isLoading">
      <Loading />
    </template>

    <template v-else-if="error">
      <RetryData
        :error="error"
        @retry="refresh()" />
    </template>

    <template v-else>
      <Demo
        email="john.doe@example.com"
        password="password123"
      />
      <JobListPreview
        :jobs="jobs"
      />
    </template>
  </section>
</template>