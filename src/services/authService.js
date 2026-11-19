import api, {
  clearAdminToken,
  ensureCsrfCookie,
  isCrossOriginBackend,
  setAdminToken,
} from './api'

export default {
  async login(credentials) {
    if (isCrossOriginBackend) {
      const { data } = await api.post('/auth/login', credentials, {
        headers: { 'X-Auth-Mode': 'token' },
      })
      if (data?.data?.token) {
        setAdminToken(data.data.token)
      }
      return data
    }

    await ensureCsrfCookie()
    const { data } = await api.post('/auth/login', credentials)
    if (data?.data?.token) {
      setAdminToken(data.data.token)
    }
    return data
  },

  async logout() {
    try {
      const { data } = await api.post('/auth/logout')
      return data
    } finally {
      clearAdminToken()
    }
  },

  async fetchMe() {
    const { data } = await api.get('/auth/me')
    return data.data
  },
}
