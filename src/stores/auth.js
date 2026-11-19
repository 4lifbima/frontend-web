import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '@/services/authService'
import { clearAdminToken, getAdminToken, isCrossOriginBackend } from '@/services/api'
import { extractApiErrors } from '@/utils/formatters'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const initialized = ref(false)
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value))

  async function initAuth() {
    if (initialized.value) return

    if (isCrossOriginBackend && !getAdminToken()) {
      user.value = null
      initialized.value = true
      return
    }

    loading.value = true
    try {
      const data = await authService.fetchMe()
      user.value = data.user
    } catch {
      user.value = null
      clearAdminToken()
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

  async function login(credentials) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      user.value = response.data.user
      initialized.value = true
      return { ok: true, user: user.value }
    } catch (error) {
      const parsed = extractApiErrors(error, 'Gagal masuk ke dashboard.')
      return { ok: false, ...parsed }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
    } finally {
      user.value = null
      clearAdminToken()
      initialized.value = true
      loading.value = false
    }
  }

  function clearAuth() {
    user.value = null
    clearAdminToken()
    initialized.value = true
  }

  return {
    user,
    initialized,
    loading,
    isAuthenticated,
    initAuth,
    login,
    logout,
    clearAuth,
  }
})
