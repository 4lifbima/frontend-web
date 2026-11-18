import api, { ensureCsrfCookie } from './api'

export default {
  async login(credentials) {
    await ensureCsrfCookie()
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  async logout() {
    const { data } = await api.post('/auth/logout')
    return data
  },

  async fetchMe() {
    const { data } = await api.get('/auth/me')
    return data.data
  },
}

