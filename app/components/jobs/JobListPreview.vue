<script setup lang="ts">
import type { JobItem } from '~/common/interface/job-item'
import JobCard from '~/components/jobs/JobCard.vue'

const props = defineProps<{
  jobs: JobItem[]
}>()

const visibleJobs = computed(() => props.jobs.slice(0, 3))
const blurredJobs = computed(() =>
  props.jobs.slice(3, 6).map(job => ({
    ...job,
    company: 'Confidential',
    salary: 'Login untuk melihat detail',
  }))
)
</script>

<template>
  <section class="space-y-4">
    <div class="grid gap-4 lg:grid-cols-3">
      <JobCard
        v-for="job in visibleJobs"
        :key="job.id"
        :job="job"
        :can-apply="false"
        hide-actions
      />
    </div>

    <div class="relative">
      <div class="grid gap-4 lg:grid-cols-3">
        <JobCard
          v-for="job in blurredJobs"
          :key="job.id"
          :job="job"
          blurred
          :can-apply="false"
          hide-actions
        />
      </div>

      <div
        v-if="blurredJobs.length"
        class="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-center"
      >
        <div class="pointer-events-auto rounded-2xl bg-default/80 p-4 backdrop-blur-sm">
          <UButton
            to="/auth/login"
            color="primary"
            size="lg"
            class="shadow-lg"
          >
            Login untuk melihat full pekerjaan
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>