<template>
    <div class="grid gap-4 lg:grid-cols-2">
        <UCard v-for="n in 4" :key="n" class="p-5">
            <div class="space-y-4">
                <div class="skeleton skeleton-text h-4 w-24" />
                <div class="skeleton skeleton-text h-5 w-48" />
                <div class="skeleton skeleton-text h-4 w-32" />
                <div class="flex gap-2">
                    <div class="skeleton skeleton-text h-6 w-16 rounded-full" />
                    <div class="skeleton skeleton-text h-6 w-16 rounded-full" />
                </div>
            </div>
        </UCard>
    </div>
</template>