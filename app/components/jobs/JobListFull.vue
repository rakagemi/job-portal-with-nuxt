<script setup lang="ts">
import type { JobItem } from '~/common/interface/job-item'
import JobCard from '~/components/jobs/JobCard.vue'
import type { ApplicationStatus } from '~/features/application/types/application-types';

defineProps<{
  jobs: JobItem[]
  savedJobIds?: string[]
  appliedJobIds?: string[]
  applyingJobIds?: string[]
  canApply?: boolean
  applicationStatuses?: Record<string, ApplicationStatus>
}>()

const emit = defineEmits<{
  (e: 'toggle-save' | 'apply', jobId: string): void
}>()
</script>

<template>
  <section class="space-y-4">
    <div class="grid gap-4 lg:grid-cols-3">
      <JobCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
        :saved="savedJobIds?.includes(job.id)"
        :has-applied="appliedJobIds?.includes(job.id)"
        :applying="applyingJobIds?.includes(job.id)"
        :can-apply="canApply"
        :application-status="applicationStatuses?.[job.id] ?? null"
        @toggle-save="emit('toggle-save', $event)"
        @apply="emit('apply', $event)"
      />
    </div>
  </section>
</template>