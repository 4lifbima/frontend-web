<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
    <div class="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <!-- Brand -->
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b39ff]/25 rounded-lg"
        @click="closeMobileMenu"
      >
        <span class="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#2b39ff] text-white shrink-0">
          <Icon icon="solar:gallery-linear" class="h-5 w-5" />
          <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-[#faf628]" />
        </span>
        <div class="leading-tight">
          <span class="block text-base font-bold tracking-tight text-[#171717]">
            Upload Karya
          </span>
          <span class="hidden sm:block text-[11px] font-medium text-[#737373]">
            Galeri Pelatihan Desain Grafis
          </span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
        <RouterLink
          to="/"
          :class="[
            'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
            route.name === 'home' && !route.hash
              ? 'bg-[#eef0ff] text-[#2b39ff]'
              : 'text-[#52525b] hover:bg-[#f8f9fc] hover:text-[#171717]',
          ]"
        >
          <Icon icon="solar:home-2-linear" class="h-4 w-4" />
          Beranda
        </RouterLink>

        <RouterLink
          :to="{ path: '/', hash: '#katalog' }"
          :class="[
            'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
            route.hash === '#katalog'
              ? 'bg-[#eef0ff] text-[#2b39ff]'
              : 'text-[#52525b] hover:bg-[#f8f9fc] hover:text-[#171717]',
          ]"
        >
          <Icon icon="solar:gallery-linear" class="h-4 w-4" />
          Katalog Karya
        </RouterLink>
      </nav>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-2.5">

        <RouterLink to="/upload">
          <AppButton variant="primary" size="md">
            <Icon icon="solar:upload-linear" class="h-4 w-4" />
            Upload Karya
          </AppButton>
        </RouterLink>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        type="button"
        class="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#171717] hover:bg-[#f8f9fc] cursor-pointer"
        :aria-expanded="mobileMenuOpen"
        aria-label="Buka menu navigasi"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Icon
          :icon="mobileMenuOpen ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear'"
          class="h-5 w-5"
        />
      </button>
    </div>

    <!-- Mobile Menu Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-[#e5e7eb] bg-white px-4 py-4 space-y-2"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#171717] hover:bg-[#f8f9fc]"
        @click="closeMobileMenu"
      >
        <Icon icon="solar:home-2-linear" class="h-4 w-4 text-[#737373]" />
        Beranda
      </RouterLink>

      <RouterLink
        :to="{ path: '/', hash: '#katalog' }"
        class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#171717] hover:bg-[#f8f9fc]"
        @click="closeMobileMenu"
      >
        <Icon icon="solar:gallery-linear" class="h-4 w-4 text-[#737373]" />
        Katalog Karya
      </RouterLink>

      <div class="pt-2 border-t border-[#f4f4f5] flex flex-col gap-2">
        <RouterLink to="/upload" @click="closeMobileMenu">
          <AppButton variant="primary" full-width>
            <Icon icon="solar:upload-linear" class="h-4 w-4" />
            Upload Karya
          </AppButton>
        </RouterLink>

        <RouterLink
          :to="authStore.isAuthenticated ? '/admin/dashboard' : '/login'"
          @click="closeMobileMenu"
        >
          <AppButton variant="outline" full-width>
            <Icon
              :icon="authStore.isAuthenticated ? 'solar:widget-2-linear' : 'solar:login-2-linear'"
              class="h-4 w-4"
            />
            {{ authStore.isAuthenticated ? 'Dashboard Pemateri' : 'Login Pemateri' }}
          </AppButton>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

