<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '@/components/layout/DashboardSidebar.vue'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const sidebarOpen = ref(false)
const loggingOut = ref(false)

async function handleLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await authStore.logout()
    toast.success('Anda berhasil keluar dari panel administrator.')
    router.push('/login')
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-[#fafafa] text-[#09090b]">
    <DashboardSidebar
      :open="sidebarOpen"
      :user="authStore.user"
      :logging-out="loggingOut"
      @close="sidebarOpen = false"
      @logout="handleLogout"
    />

    <div class="flex flex-1 flex-col min-w-0 lg:pl-64 pt-16">
      <DashboardHeader
        :title="title"
        :description="description"
        :user="authStore.user"
        :logging-out="loggingOut"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @logout="handleLogout"
      />

      <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="mx-auto max-w-[1280px]">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

