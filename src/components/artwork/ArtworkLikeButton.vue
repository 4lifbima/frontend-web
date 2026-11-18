<script setup>
import { Icon } from '@iconify/vue'
import { formatNumber } from '@/utils/formatters'

const props = defineProps({
  likesCount: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md', // sm | md
  },
})

const emit = defineEmits(['like'])

function handleClick(event) {
  event.stopPropagation()
  if (props.isLiked || props.loading) return
  emit('like')
}
</script>

<template>
  <button
    type="button"
    :disabled="isLiked || loading"
    :aria-pressed="isLiked"
    :aria-label="isLiked ? `Sudah disukai (${likesCount})` : `Beri like (${likesCount})`"
    :class="[
      'inline-flex items-center justify-center rounded-lg border font-medium tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b39ff]/25 select-none shrink-0',
      size === 'sm' ? 'h-8 px-2.5 text-xs gap-1.5' : 'h-9 px-3 text-xs sm:text-sm gap-1.5',
      isLiked
        ? 'border-[#2b39ff]/30 bg-[#eef0ff] text-[#2b39ff] cursor-default'
        : 'border-[#e5e7eb] bg-white text-[#171717] hover:border-[#2b39ff] hover:text-[#2b39ff] hover:bg-[#eef0ff]/50 active:scale-[0.98] cursor-pointer',
      loading ? 'opacity-70 cursor-wait' : '',
    ]"
    @click="handleClick"
  >
    <Icon
      v-if="loading"
      icon="solar:restart-linear"
      class="h-4 w-4 animate-spin text-[#2b39ff]"
    />
    <Icon
      v-else-if="isLiked"
      icon="solar:heart-bold"
      class="h-4 w-4 text-[#2b39ff]"
    />
    <Icon
      v-else
      icon="solar:heart-linear"
      class="h-4 w-4"
    />
    <span>{{ formatNumber(likesCount) }}</span>
  </button>
</template>

