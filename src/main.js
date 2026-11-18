import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/main.css'
import '@/utils/icons'
import App from './App.vue'
import router from './router'
import { setUnauthorizedHandler } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

setUnauthorizedHandler(() => {
  const authStore = useAuthStore(pinia)
  authStore.clearAuth()

  if (router.currentRoute.value.meta?.requiresAuth) {
    router.push({
      name: 'login',
      query: { redirect: router.currentRoute.value.fullPath },
    })
  }
})

app.mount('#app')
