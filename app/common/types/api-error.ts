export interface ApiErrorData {
  message: string
  statusCode?: number
  statusMessage?: string
}

export interface ApiError extends Error {
  statusCode?: number
  statusMessage?: string
  data?: ApiErrorData
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error
  )
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Terjadi kesalahan, coba lagi.'
): string {
  if (isApiError(error)) {
    return error.data?.message ?? error.statusMessage ?? fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.statusCode
  }
  return undefined
}