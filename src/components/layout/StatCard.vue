<script setup>
import { Icon } from '@iconify/vue'
import { formatNumber } from '@/utils/formatters'

defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    default: 0,
  },
  caption: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    required: true,
  },
  highlight: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="rounded-xl border border-[#e4e4e7] bg-white p-5 transition-colors hover:border-[#d4d4d8]">
    <div class="flex items-center justify-between gap-3">
      <span class="text-xs font-medium uppercase tracking-wider text-[#71717a]">
        {{ label }}
      </span>
      <div
        :class="[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
          highlight
            ? 'border-[#2b39ff]/20 bg-[#eef0ff] text-[#2b39ff]'
            : 'border-[#e4e4e7] bg-[#fafafa] text-[#52525b]',
        ]"
      >
        <Icon :icon="icon" class="h-4 w-4" />
      </div>
    </div>

    <div class="mt-3">
      <p class="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] tabular-nums">
        {{ typeof value === 'number' ? formatNumber(value) : value }}
      </p>
      <p v-if="caption" class="mt-1 text-xs text-[#71717a]">
        {{ caption }}
      </p>
    </div>
  </div>
</template>

