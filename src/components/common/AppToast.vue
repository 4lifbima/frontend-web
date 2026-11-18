<script setup>
import { Icon } from '@iconify/vue'
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

function iconFor(type) {
  switch (type) {
    case 'success':
      return 'solar:check-circle-linear'
    case 'error':
      return 'solar:danger-triangle-linear'
    case 'warning':
      return 'solar:danger-triangle-linear'
    default:
      return 'solar:info-circle-linear'
  }
}

function colorFor(type) {
  switch (type) {
    case 'success':
      return 'text-[#16a34a]'
    case 'error':
      return 'text-[#dc2626]'
    case 'warning':
      return 'text-[#d97706]'
    default:
      return 'text-[#2b39ff]'
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-96 pointer-events-none"
      aria-live="polite"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#e4e4e7] bg-white p-3.5 text-sm"
        >
          <Icon
            :icon="iconFor(toast.type)"
            :class="['h-5 w-5 shrink-0 mt-0.5', colorFor(toast.type)]"
          />
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="font-semibold text-[#171717] text-xs uppercase tracking-wide">
              {{ toast.title }}
            </p>
            <p class="text-[#52525b] text-sm leading-snug mt-0.5 break-words">
              {{ toast.message }}
            </p>
          </div>
          <button
            type="button"
            class="text-[#737373] hover:text-[#171717] p-0.5 rounded cursor-pointer"
            aria-label="Tutup notifikasi"
            @click="dismiss(toast.id)"
          >
            <Icon icon="solar:close-circle-linear" class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

