import { onMounted, onUnmounted } from 'vue'
import { useArtworkStore } from '@/stores/artwork'

export function useRealtimeCatalog({ pollIntervalMs = 3000 } = {}) {
  const artworkStore = useArtworkStore()
  let pollTimer = null

  function runSilentPoll() {
    if (document.visibilityState === 'hidden') return
    artworkStore.refreshCatalogSilently()
  }

  function startPolling() {
    stopPolling()
    pollTimer = setInterval(runSilentPoll, pollIntervalMs)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      artworkStore.refreshCatalogSilently()
    }
  }

  onMounted(() => {
    startPolling()
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    stopPolling()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
}
