<script setup>
import ArtworkCard from './ArtworkCard.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  artworks: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  likingIds: {
    type: Object,
    default: () => ({}),
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 12,
  },
})

const emit = defineEmits(['like', 'select', 'retry', 'upload'])
</script>

<template>
  <LoadingState v-if="loading" variant="grid" :count="6" />

  <ErrorState
    v-else-if="error"
    :message="error"
    @retry="emit('retry')"
  />

  <EmptyState
    v-else-if="artworks.length === 0"
    title="Belum Ada Karya"
    description="Jadilah peserta pertama yang membagikan hasil karya desain grafis Anda di galeri pelatihan ini."
  >
    <template #action>
      <AppButton variant="primary" @click="emit('upload')">
        Upload Karya Pertama
      </AppButton>
    </template>
  </EmptyState>

  <TransitionGroup
    v-else
    tag="div"
    move-class="transition-transform duration-300 ease-out"
    class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    <ArtworkCard
      v-for="(artwork, idx) in artworks"
      :key="artwork.id"
      :artwork="artwork"
      :rank="(currentPage - 1) * perPage + idx + 1"
      :liking="Boolean(likingIds[artwork.id])"
      @like="emit('like', $event)"
      @select="emit('select', $event)"
    />
  </TransitionGroup>
</template>

