import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import artworkService from '@/services/artworkService'
import { extractApiErrors } from '@/utils/formatters'

function compareArtworks(a, b) {
  const likeDiff = Number(b.likes_count ?? 0) - Number(a.likes_count ?? 0)
  if (likeDiff !== 0) return likeDiff

  const timeDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  if (timeDiff !== 0) return timeDiff

  return Number(b.id) - Number(a.id)
}

export const useArtworkStore = defineStore('artwork', () => {
  const artworks = ref([])
  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  })
  const loading = ref(false)
  const refreshing = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const likingIds = ref({})
  const selectedArtwork = ref(null)

  const sortedArtworks = computed(() => [...artworks.value].sort(compareArtworks))
  const hasArtworks = computed(() => artworks.value.length > 0)

  async function fetchCatalog({ page = 1, perPage = 12, search = searchQuery.value, silent = false } = {}) {
    if (silent) {
      refreshing.value = true
    } else {
      loading.value = true
      error.value = null
    }

    try {
      const payload = await artworkService.fetchPublicArtworks({ page, perPage, search })
      artworks.value = payload.items || []
      meta.value = payload.meta || {
        current_page: page,
        last_page: 1,
        per_page: perPage,
        total: artworks.value.length,
      }

      if (selectedArtwork.value) {
        const match = artworks.value.find((item) => item.id === selectedArtwork.value.id)
        if (match) {
          selectedArtwork.value = { ...selectedArtwork.value, ...match }
        }
      }
    } catch (err) {
      if (!silent) {
        const parsed = extractApiErrors(err, 'Gagal memuat katalog karya.')
        error.value = parsed.message
      }
    } finally {
      loading.value = false
      refreshing.value = false
    }
  }

  async function refreshCatalogSilently() {
    if (loading.value || refreshing.value) return
    await fetchCatalog({
      page: meta.value.current_page || 1,
      perPage: meta.value.per_page || 12,
      search: searchQuery.value,
      silent: true,
    })
  }

  async function likeArtwork(artworkId) {
    if (likingIds.value[artworkId]) {
      return { ok: false, inFlight: true }
    }

    const existing = artworks.value.find((item) => item.id === artworkId)
    if (existing?.is_liked) {
      return { ok: false, alreadyLiked: true, message: 'Anda sudah menyukai karya ini.' }
    }

    likingIds.value = { ...likingIds.value, [artworkId]: true }

    try {
      const response = await artworkService.likeArtwork(artworkId)
      const data = response.data
      updateLocalArtworkLikeState(artworkId, data.likes_count, true)
      return { ok: true, message: response.message, likesCount: data.likes_count }
    } catch (err) {
      const parsed = extractApiErrors(err, 'Gagal memberikan Like.')
      if (parsed.status === 409 && parsed.data) {
        updateLocalArtworkLikeState(artworkId, parsed.data.likes_count, true)
        return { ok: false, alreadyLiked: true, message: parsed.message }
      }
      return { ok: false, message: parsed.message }
    } finally {
      const nextMap = { ...likingIds.value }
      delete nextMap[artworkId]
      likingIds.value = nextMap
    }
  }

  function updateLocalArtworkLikeState(artworkId, likesCount, isLiked) {
    const idx = artworks.value.findIndex((item) => item.id === artworkId)
    if (idx !== -1) {
      const updated = [...artworks.value]
      updated[idx] = {
        ...updated[idx],
        likes_count: Number(likesCount),
        is_liked: Boolean(isLiked),
      }
      artworks.value = updated.sort(compareArtworks)
    }

    if (selectedArtwork.value?.id === artworkId) {
      selectedArtwork.value = {
        ...selectedArtwork.value,
        likes_count: Number(likesCount),
        is_liked: Boolean(isLiked),
      }
    }
  }

  function openArtworkDetail(artwork) {
    selectedArtwork.value = artwork
  }

  function closeArtworkDetail() {
    selectedArtwork.value = null
  }

  return {
    artworks,
    meta,
    loading,
    refreshing,
    error,
    searchQuery,
    likingIds,
    selectedArtwork,
    sortedArtworks,
    hasArtworks,
    fetchCatalog,
    refreshCatalogSilently,
    likeArtwork,
    openArtworkDetail,
    closeArtworkDetail,
  }
})

