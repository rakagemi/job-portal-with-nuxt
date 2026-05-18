<script setup lang="ts">
import type { NuxtError } from '#app';
import { getApiErrorMessage } from '~/common/types/api-error';

interface Props {
    error: NuxtError<unknown> | undefined;
    title?: string;
    retryLabel?: string;
}

withDefaults(defineProps<Props>(), {
    title: 'Gagal memuat data',
    retryLabel: 'Coba lagi'
});

const emit = defineEmits<{
    (e: 'retry'): void;
}>();
</script>

<template>
    <UCard>
        <div class="flex flex-col items-center gap-4 py-8 text-center">
            <UIcon name="i-lucide-circle-alert" class="size-10 text-error" />
            <div>
                <p class="font-medium text-highlighted">
                    {{ title }}
                </p>
                <p class="text-sm text-muted">
                    {{ getApiErrorMessage(error) }}
                </p>
            </div>
            <UButton color="neutral" variant="outline" icon="i-lucide-refresh-cw" @click="emit('retry')">
                {{ retryLabel }}
            </UButton>
        </div>
    </UCard>
</template>