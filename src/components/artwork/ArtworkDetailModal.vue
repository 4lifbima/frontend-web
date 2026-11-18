<script setup>
import { Icon } from '@iconify/vue'
import AppModal from '@/components/common/AppModal.vue'
import ArtworkLikeButton from './ArtworkLikeButton.vue'
import { formatDateTime } from '@/utils/formatters'

defineProps({
  artwork: {
    type: Object,
    default: null,
  },
  liking: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'like'])
</script>

<template>
  <AppModal
    :open="Boolean(artwork)"
    max-width="max-w-3xl"
    :title="artwork?.title || 'Detail Karya'"
    :description="artwork ? `Karya oleh ${artwork.participant_name}` : ''"
    @close="emit('close')"
  >
    <div v-if="artwork" class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div class="md:col-span-7 rounded-xl border border-[#e5e7eb] bg-[#f8f9fc] overflow-hidden flex items-center justify-center p-2">
        <img
          :src="artwork.image_url"
          :alt="artwork.title"
          class="max-h-[60vh] w-full rounded-lg object-contain bg-white"
        />
      </div>

      <div class="md:col-span-5 flex flex-col justify-between space-y-5">
        <div class="space-y-4">
          <div class="space-y-1">
            <span class="text-xs font-medium uppercase tracking-wider text-[#737373]">
              Peserta
            </span>
            <div class="flex items-center gap-2 text-sm font-semibold text-[#171717]">
              <Icon icon="solar:user-linear" class="h-4 w-4 text-[#2b39ff]" />
              {{ artwork.participant_name }}
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-xs font-medium uppercase tracking-wider text-[#737373]">
              Tanggal Unggah
            </span>
            <div class="flex items-center gap-2 text-sm text-[#52525b]">
              <Icon icon="solar:calendar-linear" class="h-4 w-4 text-[#737373]" />
              {{ formatDateTime(artwork.created_at) }}
            </div>
          </div>

          <div class="space-y-1.5 pt-2 border-t border-[#f4f4f5]">
            <span class="text-xs font-medium uppercase tracking-wider text-[#737373]">
              Deskripsi Karya
            </span>
            <p
              v-if="artwork.description"
              class="text-sm text-[#52525b] leading-relaxed whitespace-pre-line"
            >
              {{ artwork.description }}
            </p>
            <p v-else class="text-sm italic text-[#a1a1aa]">
              Tidak ada deskripsi tambahan untuk karya ini.
            </p>
          </div>
        </div>

        <div class="rounded-xl border border-[#e5e7eb] bg-[#f8f9fc] p-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-[#737373]">Apresiasi Pengunjung</p>
            <p class="text-sm font-semibold text-[#171717]">
              {{ artwork.is_liked ? 'Anda menyukai karya ini' : 'Berikan Like untuk karya ini' }}
            </p>
          </div>
          <ArtworkLikeButton
            :likes-count="artwork.likes_count"
            :is-liked="artwork.is_liked"
            :loading="liking"
            @like="emit('like', artwork.id)"
          />
        </div>
      </div>
    </div>
  </AppModal>
</template>

