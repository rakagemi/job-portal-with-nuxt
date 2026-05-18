<script setup lang="ts">
import { useStatusColors } from '~/composables/useStatusColors';
import type { JobItem } from '~/common/interface/job-item'
import type { ApplicationStatus } from '~/features/application/types/application-types';

defineProps<{
    job: JobItem
    blurred?: boolean
    saved?: boolean
    hasApplied?: boolean
    applying?: boolean
    hideActions?: boolean
    canApply?: boolean
    applicationStatus?: ApplicationStatus | null
}>()

const emit = defineEmits<{
    (e: 'toggle-save' | 'apply', jobId: string): void
}>()

const { getStatusColor } = useStatusColors()
</script>

<template>
    <article
        class="rounded-2xl border border-default bg-default/75 p-5 shadow-sm backdrop-blur-sm transition hover:border-accented hover:shadow-md"
        :class="blurred ? 'select-none opacity-70 blur-[2px]' : ''">
        <div class="flex items-start justify-between gap-4">
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <span class="rounded-full bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                        {{ job.type }}
                    </span>
                    <span
                        class="text-xs bg-linear-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent">
                        {{ job.location }}
                    </span>

                    <UBadge v-if="applicationStatus" :color="getStatusColor(applicationStatus)" variant="soft">
                        {{ applicationStatus }}
                    </UBadge>
                </div>

                <div>
                    <h3 class="text-lg font-semibold tracking-tight text-highlighted">
                        {{ job.title }}
                    </h3>
                    <p class="text-sm text-toned">
                        {{ job.company }}
                    </p>
                </div>
            </div>

            <UButton
                :ui="{ base: 'cursor-pointer' }" type="button"
                class="rounded-lg border p-2 transition hover:bg-elevated hover:text-highlighted" :class="[
                    blurred
                        ? 'border-default! bg-default/10! text-muted!'
                        : saved
                            ? 'border-primary bg-primary text-white'
                            : 'border-default bg-default/10 text-muted'
                ]" :aria-label="saved ? 'Unsave job' : 'Save job'" :disabled="blurred"
                @click="emit('toggle-save', job.id)">
                {{ saved ? '★' : '☆' }}
            </UButton>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
            <span
                v-for="(tag, index) in job.tags" :key="tag" class="rounded-full px-2.5 py-1 text-xs" :class="{
                'bg-info/20 text-info': index % 3 === 0,
                'bg-warning/20 text-warning': index % 3 === 1,
                'bg-error/20 text-error': index % 3 === 2
            }">
                {{ tag }}
            </span>
        </div>

        <div class="mt-5 flex items-center justify-between">
            <p class="text-sm font-medium text-highlighted flex items-center gap-1.5">
                <UIcon name="i-lucide-banknote" class="size-4 text-primary shrink-0" />
                {{ job.salary }}
            </p>

            <div v-if="!hideActions" class="flex items-center gap-2">
                <UButton
                    :ui="{ base: 'cursor-pointer' }" color="neutral" variant="ghost" size="sm"
                    :to="`/jobs/${job.id}`">
                    Detail
                </UButton>

                <!-- <UButton
                    v-if="!hasApplied"
                    :ui="{ base: 'cursor-pointer' }" color="primary" size="sm" :loading="applying"
                    :disabled="blurred || hasApplied || applying" :to="canApply ? undefined : '/auth/login'"
                    @click="emit('apply', job.id)">
                    {{ hasApplied ? 'Applied' : 'Apply' }}
                </UButton> -->
            </div>
        </div>
    </article>
</template>