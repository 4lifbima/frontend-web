<script setup>
import { Icon } from '@iconify/vue'
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  src: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    default: '',
  },
  fileSizeLabel: {
    type: String,
    default: '',
  },
  allowRemove: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['replace', 'remove'])
</script>

<template>
  <div class="rounded-xl border border-[#e5e7eb] bg-[#f8f9fc] overflow-hidden">
    <div class="flex items-center justify-center p-4 bg-[#f8f9fc]">
      <img
        :src="src"
        alt="Preview karya desain"
        class="max-h-72 w-auto rounded-lg border border-[#e5e7eb] object-contain bg-white"
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] bg-white px-4 py-3">
      <div class="min-w-0">
        <p class="text-xs font-medium text-[#171717] truncate">
          {{ fileName || 'Gambar karya terpilih' }}
        </p>
        <p v-if="fileSizeLabel" class="text-[11px] text-[#737373] mt-0.5">
          {{ fileSizeLabel }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <AppButton
          variant="outline"
          size="sm"
          :disabled="disabled"
          @click="emit('replace')"
        >
          <Icon icon="solar:pen-linear" class="h-3.5 w-3.5" />
          Ganti Gambar
        </AppButton>
        <AppButton
          v-if="allowRemove"
          variant="ghost"
          size="sm"
          :disabled="disabled"
          class="text-[#dc2626] hover:bg-[#fef2f2] hover:text-[#dc2626]"
          @click="emit('remove')"
        >
          <Icon icon="solar:trash-bin-trash-linear" class="h-3.5 w-3.5" />
          Hapus
        </AppButton>
      </div>
    </div>
  </div>
</template>

