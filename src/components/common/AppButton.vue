<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary', // primary | secondary | outline | ghost | destructive
  },
  size: {
    type: String,
    default: 'md', // sm | md | lg | icon
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-[#f4f4f5] text-[#171717] border border-[#e4e4e7] hover:bg-[#e4e4e7]/70 active:bg-[#e4e4e7]'
    case 'outline':
      return 'bg-white text-[#171717] border border-[#e5e7eb] hover:bg-[#f8f9fc] hover:border-[#d4d4d8] active:bg-[#f4f4f5]'
    case 'ghost':
      return 'bg-transparent text-[#52525b] border border-transparent hover:bg-[#f4f4f5] hover:text-[#171717]'
    case 'destructive':
      return 'bg-[#dc2626] text-white border border-[#dc2626] hover:bg-[#b91c1c] hover:border-[#b91c1c] active:bg-[#991b1b]'
    case 'primary':
    default:
      return 'bg-[#2b39ff] text-white border border-[#2b39ff] hover:bg-[#202edb] hover:border-[#202edb] active:bg-[#1a25b8]'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-3 text-xs rounded-lg gap-1.5'
    case 'lg':
      return 'h-12 px-6 text-sm rounded-lg gap-2'
    case 'icon':
      return 'h-9 w-9 p-0 rounded-lg justify-center'
    case 'md':
    default:
      return 'h-10 px-4 text-sm rounded-lg gap-2'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b39ff]/30 focus-visible:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap',
      variantClasses,
      sizeClasses,
      fullWidth ? 'w-full' : '',
    ]"
  >
    <Icon
      v-if="loading"
      icon="solar:restart-linear"
      class="h-4 w-4 animate-spin shrink-0"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

