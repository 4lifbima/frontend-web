<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  icon: {
    type: String,
    default: 'solar:gallery-linear',
  },
  title: {
    type: String,
    default: 'Belum Ada Karya',
  },
  description: {
    type: String,
    default: 'Belum ada karya desain yang diunggah ke katalog.',
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#f8f9fc] px-6 py-14">
    <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#737373] mb-4">
      <Icon :icon="icon" class="h-6 w-6" />
    </div>
    <h3 class="text-base font-semibold text-[#171717]">
      {{ title }}
    </h3>
    <p class="mt-1.5 max-w-md text-sm text-[#737373]">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-5">
      <slot name="action" />
    </div>
  </div>
</template>

