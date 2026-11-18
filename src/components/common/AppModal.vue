<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: 'max-w-lg',
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

function handleKeydown(event) {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/45"
        role="dialog"
        aria-modal="true"
        @click.self="closeOnBackdrop && emit('close')"
      >
        <div
          :class="[
            'w-full bg-white border border-[#e4e4e7] rounded-xl overflow-hidden flex flex-col max-h-[90vh]',
            maxWidth,
          ]"
        >
          <div
            v-if="title || $slots.header"
            class="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#e4e4e7]"
          >
            <slot name="header">
              <div>
                <h2 class="text-base font-semibold text-[#171717] tracking-tight">
                  {{ title }}
                </h2>
                <p v-if="description" class="mt-0.5 text-xs text-[#737373]">
                  {{ description }}
                </p>
              </div>
            </slot>

            <button
              type="button"
              class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-[#737373] hover:bg-[#f4f4f5] hover:text-[#171717] transition-colors cursor-pointer"
              aria-label="Tutup dialog"
              @click="emit('close')"
            >
              <Icon icon="solar:close-circle-linear" class="h-5 w-5" />
            </button>
          </div>

          <div class="p-5 overflow-y-auto flex-1">
            <slot />
          </div>

          <div
            v-if="$slots.footer"
            class="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[#e4e4e7] bg-[#fafafa]"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

