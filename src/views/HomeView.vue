<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import ArtworkGrid from '@/components/artwork/ArtworkGrid.vue'
import ArtworkDetailModal from '@/components/artwork/ArtworkDetailModal.vue'
import { useArtworkStore } from '@/stores/artwork'
import { useRealtimeCatalog } from '@/composables/useRealtimeCatalog'
import { useToast } from '@/composables/useToast'
import { formatNumber } from '@/utils/formatters'
import heroDesignerImg from '@/assets/hero-designer.webp'

const router = useRouter()
const artworkStore = useArtworkStore()
const toast = useToast()

const localSearch = ref(artworkStore.searchQuery)
let searchDebounceTimer = null

useRealtimeCatalog({ pollIntervalMs: 6000 })

watch(localSearch, (value) => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    artworkStore.searchQuery = value.trim()
    artworkStore.fetchCatalog({ page: 1, search: artworkStore.searchQuery })
  }, 350)
})

async function handleLike(artworkId) {
  const result = await artworkStore.likeArtwork(artworkId)
  if (result.inFlight) return

  if (result.ok) {
    toast.success('Terima kasih! Apresiasi Anda telah tercatat.')
  } else if (result.alreadyLiked) {
    toast.info(result.message || 'Anda sudah memberikan Like pada karya ini.')
  } else {
    toast.error(result.message || 'Gagal memberikan Like.')
  }
}

function handlePageChange(page) {
  artworkStore.fetchCatalog({ page, search: artworkStore.searchQuery })
  document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })
}

function clearSearch() {
  localSearch.value = ''
}

onMounted(() => {
  artworkStore.fetchCatalog({ page: 1, search: artworkStore.searchQuery })
})

onUnmounted(() => {
  clearTimeout(searchDebounceTimer)
})
</script>

<template>
  <PublicLayout>
    <!-- Hero Section -->
    <section class="border-b border-[#e5e7eb] bg-white">
      <div class="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <!-- Hero Copy -->
          <div class="lg:col-span-7 space-y-6">

            <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Pamerkan Karya Terbaik, Raih Apresiasi Nyata.
            </h1>

            <p class="max-w-xl text-base sm:text-lg text-[#737373] leading-relaxed">
              Ruang kurasi digital bagi peserta pelatihan desain grafis untuk mengumpulkan hasil karya, berbagi proses kreatif, dan mendapatkan apresiasi secara langsung.
            </p>

            <div class="flex sm:flex-col md:flex-col lg:flex-row items-stretch gap-3 pt-1">
              <RouterLink to="/upload">
                <AppButton variant="primary" size="lg" full-width class="sm:w-auto">
                  <Icon icon="solar:upload-linear" class="h-4 w-4" />
                  Upload Karya
                </AppButton>
              </RouterLink>

              <a href="#katalog">
                <AppButton variant="outline" size="lg" full-width class="sm:w-auto">
                  Jelajahi Karya
                  <Icon icon="solar:arrow-right-linear" class="h-4 w-4" />
                </AppButton>
              </a>
            </div>

          </div>

          <!-- Hero Static Vector Illustration -->
          <div class="lg:col-span-5">
            <div class="overflow-hidden rounded-xl bg-white p-3 sm:p-4">
              <img
                :src="heroDesignerImg"
                alt="Ilustrasi vektor peserta pelatihan desain grafis berkarya menggunakan tablet gambar dan laptop"
                class="h-auto w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Catalog Section -->
    <section id="katalog" class="scroll-mt-20 py-16 sm:py-20 bg-white">
      <div class="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Jelajahi Karya Peserta
            </h2>
            <p class="text-sm sm:text-base text-[#737373]">
              Temukan kreativitas dan hasil karya terbaik dari seluruh peserta pelatihan.
            </p>
          </div>

          <!-- Search Input -->
          <div class="w-full lg:w-80">
            <AppInput
              v-model="localSearch"
              placeholder="Cari judul karya atau nama peserta..."
              leading-icon="solar:magnifier-linear"
            >
              <template v-if="localSearch" #trailing>
                <button
                  type="button"
                  class="text-[#737373] hover:text-[#171717] p-1 cursor-pointer"
                  aria-label="Hapus pencarian"
                  @click="clearSearch"
                >
                  <Icon icon="solar:close-circle-linear" class="h-4 w-4" />
                </button>
              </template>
            </AppInput>
          </div>
        </div>

        <ArtworkGrid
          :artworks="artworkStore.sortedArtworks"
          :loading="artworkStore.loading"
          :error="artworkStore.error"
          :liking-ids="artworkStore.likingIds"
          :current-page="artworkStore.meta.current_page"
          :per-page="artworkStore.meta.per_page"
          @like="handleLike"
          @select="artworkStore.openArtworkDetail"
          @retry="artworkStore.fetchCatalog({ page: 1, search: artworkStore.searchQuery })"
          @upload="router.push('/upload')"
        />

        <AppPagination
          :current-page="artworkStore.meta.current_page"
          :last-page="artworkStore.meta.last_page"
          :total="artworkStore.meta.total"
          @change="handlePageChange"
        />
      </div>
    </section>

    <ArtworkDetailModal
      :artwork="artworkStore.selectedArtwork"
      :liking="Boolean(artworkStore.selectedArtwork && artworkStore.likingIds[artworkStore.selectedArtwork.id])"
      @close="artworkStore.closeArtworkDetail"
      @like="handleLike"
    />
  </PublicLayout>
</template>
