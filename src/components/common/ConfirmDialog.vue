<script setup>
import { Icon } from '@iconify/vue'
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Konfirmasi Hapus',
  },
  description: {
    type: String,
    default: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  },
  confirmLabel: {
    type: String,
    default: 'Hapus Permanen',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <AppModal
    :open="open"
    max-width="max-w-md"
    :close-on-backdrop="!loading"
    @close="!loading && emit('close')"
  >
    <div class="flex items-start gap-3.5">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#fecaca] bg-[#fef2f2] text-[#dc2626]">
        <Icon icon="solar:danger-triangle-linear" class="h-5 w-5" />
      </div>
      <div class="space-y-1.5">
        <h3 class="text-base font-semibold text-[#171717]">
          {{ title }}
        </h3>
        <p class="text-sm text-[#737373] leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>

    <template #footer>
      <AppButton
        variant="outline"
        size="sm"
        :disabled="loading"
        @click="emit('close')"
      >
        Batal
      </AppButton>
      <AppButton
        variant="destructive"
        size="sm"
        :loading="loading"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </AppButton>
    </template>
  </AppModal>
</template>

