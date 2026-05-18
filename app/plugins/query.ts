// plugins/vue-query.ts
import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'
import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
    const vueQueryState = useState<DehydratedState | null>('vue-query')

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 30,
                refetchOnWindowFocus: false,
            },
        },
    })

    const options: VueQueryPluginOptions = { queryClient }
    nuxtApp.vueApp.use(VueQueryPlugin, options)

    if (import.meta.server) {
        nuxtApp.hooks.hook('app:rendered', () => {
            vueQueryState.value = dehydrate(queryClient)
        })
    }

    if (import.meta.client) {
        hydrate(queryClient, vueQueryState.value)
    }
})