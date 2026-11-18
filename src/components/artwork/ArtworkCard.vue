<script setup>
import ArtworkLikeButton from './ArtworkLikeButton.vue'

defineProps({
  artwork: {
    type: Object,
    required: true,
  },
  rank: {
    type: Number,
    default: null,
  },
  liking: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['like', 'select'])
</script>

<template>
  <article
    class="group flex flex-col rounded-xl border border-[#e5e7eb] bg-white overflow-hidden transition-colors duration-150 hover:border-[#d4d4d8]"
  >
    <button
      type="button"
      class="relative aspect-[4/5] w-full overflow-hidden bg-[#f8f9fc] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2b39ff]"
      @click="emit('select', artwork)"
    >
      <img
        :src="artwork.image_url"
        :alt="artwork.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />

      <span
        v-if="rank && rank <= 3"
        :class="[
          'absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tabular-nums',
          rank === 1
            ? 'border-[#171717]/15 bg-[#faf628] text-[#171717]'
            : 'border-[#e5e7eb] bg-white/95 text-[#171717]',
        ]"
      >
        #{{ rank }} Terfavorit
      </span>
    </button>

    <div class="flex flex-1 flex-col justify-between gap-3 p-4">
      <div class="min-w-0">
        <p class="text-xs font-medium text-[#737373] truncate">
          {{ artwork.participant_name }}
        </p>
        <button
          type="button"
          class="mt-1 block w-full text-left cursor-pointer focus-visible:outline-none"
          @click="emit('select', artwork)"
        >
          <h3 class="text-[12px] font-semibold text-[#171717] leading-snug line-clamp-2 group-hover:text-[#2b39ff] transition-colors">
            {{ artwork.title }}
          </h3>
        </button>
      </div>

      <div class="flex items-center justify-between gap-2 pt-2 border-t border-[#f4f4f5]">
        <button
          type="button"
          class="text-xs font-medium text-[#737373] hover:text-[#171717] transition-colors cursor-pointer"
          @click="emit('select', artwork)"
        >
          Lihat detail
        </button>

        <ArtworkLikeButton
          :likes-count="artwork.likes_count"
          :is-liked="artwork.is_liked"
          :loading="liking"
          size="sm"
          @like="emit('like', artwork.id)"
        />
      </div>
    </div>
  </article>
</template>

