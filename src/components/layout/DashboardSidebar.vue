<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
  loggingOut: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'logout'])
const route = useRoute()

const navItems = [
  {
    name: 'admin.dashboard',
    to: '/admin/dashboard',
    label: 'Overview',
    icon: 'solar:widget-2-linear',
  },
  {
    name: 'admin.artworks',
    to: '/admin/artworks',
    label: 'Kelola Karya',
    icon: 'solar:gallery-linear',
  },
]
</script>

<template>
  <!-- Mobile Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-[#09090b]/40 lg:hidden"
    @click="emit('close')"
  />

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r border-[#e4e4e7] bg-white transition-transform duration-200 lg:z-40 lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Sidebar Brand Header -->
    <div class="flex h-16 shrink-0 items-center justify-between border-b border-[#e4e4e7] px-5">
      <RouterLink to="/admin/dashboard" class="inline-flex items-center gap-2.5" @click="emit('close')">
        <span class="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b39ff] text-white shrink-0">
          <Icon icon="solar:gallery-linear" class="h-4 w-4" />
          <span class="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-[#faf628]" />
        </span>
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold tracking-tight text-[#09090b]">
            Upload Karya
          </span>
        </div>
      </RouterLink>

      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b] lg:hidden cursor-pointer"
        aria-label="Tutup sidebar"
        @click="emit('close')"
      >
        <Icon icon="solar:close-circle-linear" class="h-5 w-5" />
      </button>
    </div>

    <!-- Navigation Groups -->
    <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <div>
        <p class="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
          Menu Utama
        </p>
        <nav class="space-y-1" aria-label="Menu Administrator">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            :class="[
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              route.name === item.name
                ? 'bg-[#2b39ff] text-white'
                : 'text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#09090b]',
            ]"
            @click="emit('close')"
          >
            <Icon :icon="item.icon" class="h-4 w-4 shrink-0" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>

      <div>
        <p class="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
          Pintasan
        </p>
        <nav class="space-y-1">
          <RouterLink
            to="/"
            class="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#09090b] transition-colors"
            @click="emit('close')"
          >
            <span class="inline-flex items-center gap-2.5">
              <Icon icon="solar:home-2-linear" class="h-4 w-4 shrink-0" />
              Galeri Publik
            </span>
            <Icon icon="solar:square-top-down-linear" class="h-3.5 w-3.5 text-[#a1a1aa]" />
          </RouterLink>

          <RouterLink
            to="/upload"
            class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#09090b] transition-colors"
            @click="emit('close')"
          >
            <Icon icon="solar:upload-linear" class="h-4 w-4 shrink-0" />
            Form Upload Karya
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- Administrator Footer Card -->
    <div class="shrink-0 border-t border-[#e4e4e7] p-3 space-y-2">
      <div class="flex items-center gap-2.5 rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-semibold text-white">
          <img src="/alifbims.png" class="w-6 object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-semibold text-[#09090b]">
            {{ user?.name || 'Pemateri' }}
          </p>
          <p class="truncate text-[11px] text-[#71717a]">
            {{ user?.email || 'admin@uploadkarya.id' }}
          </p>
        </div>
      </div>

      <button
        type="button"
        :disabled="loggingOut"
        class="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2] transition-colors cursor-pointer disabled:opacity-50"
        @click="emit('logout')"
      >
        <Icon
          :icon="loggingOut ? 'solar:restart-linear' : 'solar:logout-2-linear'"
          :class="['h-4 w-4 shrink-0', loggingOut ? 'animate-spin' : '']"
        />
        <span>{{ loggingOut ? 'Keluar...' : 'Logout' }}</span>
      </button>
    </div>
  </aside>
</template>

