import axios from 'axios'
import { ADMIN_TOKEN_STORAGE_KEY, VISITOR_TOKEN_STORAGE_KEY } from '@/utils/constants'

function resolveApiBaseUrl() {
  let configured = (import.meta.env.VITE_API_BASE_URL || '/api/v1').trim()

  if (!configured) {
    return '/api/v1'
  }

  if (!configured.startsWith('/') && !/^https?:\/\//i.test(configured)) {
    configured = `https://${configured}`
  }

  if (configured.startsWith('/')) {
    return configured.replace(/\/+$/, '') || '/api/v1'
  }

  try {
    const parsed = new URL(configured, window.location.origin)
    const isLocalTarget = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    const browserHost = window.location.hostname
    const isBrowserLan = browserHost && browserHost !== 'localhost' && browserHost !== '127.0.0.1'

    if (isLocalTarget && isBrowserLan) {
      parsed.hostname = browserHost
    }

    return parsed.toString().replace(/\/$/, '')
  } catch {
    return configured.replace(/\/+$/, '')
  }
}

function resolveBackendRootUrl(baseUrl) {
  const normalized = baseUrl.replace(/\/+$/, '')
  const root = normalized.replace(/\/api(\/v\d+)?$/i, '')
  return root || ''
}

const apiBaseUrl = resolveApiBaseUrl()
const backendRootUrl = resolveBackendRootUrl(apiBaseUrl)

export const isCrossOriginBackend = (() => {
  try {
    return new URL(apiBaseUrl, window.location.origin).origin !== window.location.origin
  } catch {
    return false
  }
})()

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function getAdminToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function setAdminToken(token) {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token)
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export function clearAdminToken() {
  setAdminToken('')
}

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

export async function ensureCsrfCookie() {
  const csrfPath = backendRootUrl ? `${backendRootUrl}/sanctum/csrf-cookie` : '/sanctum/csrf-cookie'
  await axios.get(csrfPath, {
    withCredentials: true,
  })
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()

  if (!isCrossOriginBackend && ['post', 'put', 'patch', 'delete'].includes(method)) {
    const hasXsrfCookie = typeof document !== 'undefined' && document.cookie.includes('XSRF-TOKEN=')
    if (!hasXsrfCookie) {
      await ensureCsrfCookie()
    }
  }

  const adminToken = getAdminToken()
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }

  try {
    const visitorToken = localStorage.getItem(VISITOR_TOKEN_STORAGE_KEY)
    if (visitorToken) {
      config.headers['X-Visitor-Token'] = visitorToken
    }
  } catch {
    // Ignore storage access errors in restricted contexts
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers?.['x-visitor-token']
    if (newToken) {
      try {
        localStorage.setItem(VISITOR_TOKEN_STORAGE_KEY, newToken)
      } catch {
        // Ignore storage write errors
      }
    }

    if (typeof response.data === 'string' && /^\s*</.test(response.data)) {
      return Promise.reject({
        response: {
          status: response.status,
          data: {
            success: false,
            message: 'Endpoint API mengembalikan halaman HTML bukan JSON. Periksa konfigurasi VITE_API_BASE_URL.',
          },
        },
      })
    }

    return response
  },
  (error) => {
    const newToken = error?.response?.headers?.['x-visitor-token']
    if (newToken) {
      try {
        localStorage.setItem(VISITOR_TOKEN_STORAGE_KEY, newToken)
      } catch {
        // Ignore storage write errors
      }
    }

    if (error?.response?.status === 401) {
      clearAdminToken()
      if (typeof unauthorizedHandler === 'function') {
        unauthorizedHandler(error)
      }
    }

    return Promise.reject(error)
  },
)

export default api
