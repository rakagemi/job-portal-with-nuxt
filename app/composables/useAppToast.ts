import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

export function useAppToast() {
  const toast = useToast()

  function success(title: string, description?: string) {
    toast.add({
      title,
      description,
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  }

  function error(title: string, description?: string) {
    toast.add({
      title,
      description,
      color: 'error',
      icon: 'i-lucide-circle-alert',
    })
  }

  function info(title: string, description?: string) {
    toast.add({
      title,
      description,
      color: 'info',
      icon: 'i-lucide-info',
    })
  }

  return {
    success,
    error,
    info,
  }
}