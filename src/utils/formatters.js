export function formatDate(isoString) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(isoString) {
  if (!isoString) return '-'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value ?? 0))
}

export function extractApiErrors(error, fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.') {
  const responseData = error?.response?.data
  const message = responseData?.message || fallbackMessage
  const rawErrors = responseData?.errors || {}

  const fieldErrors = {}
  for (const [key, val] of Object.entries(rawErrors)) {
    fieldErrors[key] = Array.isArray(val) ? val[0] : String(val)
  }

  return {
    status: error?.response?.status ?? 0,
    message,
    fieldErrors,
    data: responseData?.data ?? null,
  }
}

