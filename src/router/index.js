import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const HomeView = () => import('@/views/HomeView.vue')
const UploadView = () => import('@/views/UploadView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const ManageArtworksView = () => import('@/views/ManageArtworksView.vue')

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Beranda — Upload Karya', layout: 'public' },
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView,
      meta: { title: 'Upload Karya — Bagikan Karyamu', layout: 'public' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login Pemateri — Upload Karya', layout: 'auth', guestOnly: true },
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard',
    },
    {
      path: '/admin/dashboard',
      name: 'admin.dashboard',
      component: DashboardView,
      meta: { title: 'Dashboard — Upload Karya Admin', layout: 'admin', requiresAuth: true },
    },
    {
      path: '/admin/artworks',
      name: 'admin.artworks',
      component: ManageArtworksView,
      meta: { title: 'Kelola Karya — Upload Karya Admin', layout: 'admin', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.initAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'admin.dashboard' }
  }

  return true
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router

