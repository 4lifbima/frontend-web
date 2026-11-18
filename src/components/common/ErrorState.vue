<script setup>
import { Icon } from '@iconify/vue'
import AppButton from './AppButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Gagal Memuat Data',
  },
  message: {
    type: String,
    default: 'Terjadi kendala saat terhubung ke server. Silakan coba lagi.',
  },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center rounded-xl border border-[#fecaca] bg-[#fef2f2]/50 px-6 py-12">
    <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[#fecaca] bg-white text-[#dc2626] mb-4">
      <Icon icon="solar:danger-triangle-linear" class="h-6 w-6" />
    </div>
    <h3 class="text-base font-semibold text-[#171717]">
      {{ title }}
    </h3>
    <p class="mt-1.5 max-w-md text-sm text-[#737373]">
      {{ message }}
    </p>
    <AppButton
      variant="outline"
      size="sm"
      class="mt-5"
      @click="emit('retry')"
    >
      <Icon icon="solar:refresh-linear" class="h-4 w-4" />
      Coba Lagi
    </AppButton>
  </div>
</template>

