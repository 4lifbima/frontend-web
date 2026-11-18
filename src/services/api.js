import axios from 'axios'
import { VISITOR_TOKEN_STORAGE_KEY } from '@/utils/constants'

function resolveApiBaseUrl() {
  const configured = (import.meta.env.VITE_API_BASE_URL || '/api/v1').trim()

  if (configured.startsWith('/')) {
    return configured
  }

  try {
    const parsed = new URL(configured, window.location.origin)
    const isLocalTarget = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    const browserHost = window.location.hostname
    const isBrowserLan = browserHost && browserHost !== 'localhost' && browserHost !== '127.0.0.1'

    // If accessed via LAN IP (e.g. phone testing), replace localhost backend host with active host
    if (isLocalTarget && isBrowserLan) {
      parsed.hostname = browserHost
    }

    return parsed.toString().replace(/\/$/, '')
  } catch {
    return configured
  }
}

const apiBaseUrl = resolveApiBaseUrl()

let backendOrigin = window.location.origin
try {
  backendOrigin = new URL(apiBaseUrl, window.location.origin).origin
} catch {
  backendOrigin = window.location.origin
}

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
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
  await axios.get(`${backendOrigin}/sanctum/csrf-cookie`, {
    withCredentials: true,
  })
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const hasXsrfCookie = typeof document !== 'undefined' && document.cookie.includes('XSRF-TOKEN=')
    if (!hasXsrfCookie) {
      await ensureCsrfCookie()
    }
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

    if (error?.response?.status === 401 && typeof unauthorizedHandler === 'function') {
      unauthorizedHandler(error)
    }

    return Promise.reject(error)
  },
)

export default api
