import api from './api'

export default {
  async fetchPublicArtworks({ page = 1, perPage = 12, search = '' } = {}) {
    const params = { page, per_page: perPage }
    if (search) params.search = search
    const { data } = await api.get('/artworks', { params })
    return data.data
  },

  async fetchPublicArtworkDetail(id) {
    const { data } = await api.get(`/artworks/${id}`)
    return data.data
  },

  async uploadArtwork(formData, onUploadProgress) {
    const { data } = await api.post('/artworks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })
    return data
  },

  async likeArtwork(id) {
    const { data } = await api.post(`/artworks/${id}/like`)
    return data
  },

  async fetchLikeStatus(id) {
    const { data } = await api.get(`/artworks/${id}/like-status`)
    return data.data
  },

  async fetchAdminDashboard() {
    const { data } = await api.get('/admin/dashboard')
    return data.data
  },

  async fetchAdminArtworks({ page = 1, perPage = 10, search = '', sort = 'newest', filter = 'all' } = {}) {
    const params = { page, per_page: perPage, sort, filter }
    if (search) params.search = search
    const { data } = await api.get('/admin/artworks', { params })
    return data.data
  },

  async fetchAdminArtworkDetail(id) {
    const { data } = await api.get(`/admin/artworks/${id}`)
    return data.data
  },

  async updateAdminArtwork(id, formData) {
    formData.append('_method', 'PUT')
    const { data } = await api.post(`/admin/artworks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async deleteAdminArtwork(id) {
    await api.delete(`/admin/artworks/${id}`)
  },
}

