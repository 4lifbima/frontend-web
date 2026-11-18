<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
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

const emit = defineEmits(['toggle-sidebar', 'logout'])
</script>

<template>
  <header class="fixed top-0 right-0 left-0 lg:left-64 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#e4e4e7] bg-white px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3 min-w-0">
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e4e7] text-[#171717] hover:bg-[#f4f4f5] lg:hidden cursor-pointer shrink-0"
        aria-label="Buka menu sidebar"
        @click="emit('toggle-sidebar')"
      >
        <Icon icon="solar:hamburger-menu-linear" class="h-5 w-5" />
      </button>

      <div class="min-w-0">
        <div class="flex items-center gap-2 text-xs text-[#71717a]">
          <span>Admin</span>
          <span>/</span>
          <span class="font-medium text-[#09090b] truncate">{{ title }}</span>
        </div>
        <p v-if="description" class="hidden sm:block truncate text-xs text-[#71717a] mt-0.5">
          {{ description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2.5 shrink-0">

      <div class="hidden md:flex items-center gap-2 rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-2.5 py-1.5">
        <Icon icon="solar:shield-check-linear" class="h-4 w-4 text-[#2b39ff]" />
        <span class="text-xs font-medium text-[#171717]">
          {{ user?.name || 'Administrator' }}
        </span>
      </div>
    </div>
  </header>
</template>

