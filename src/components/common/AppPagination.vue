<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['change'])

const pages = computed(() => {
  const totalPages = props.lastPage
  const current = props.currentPage
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1)
  }

  const list = [1]
  if (current > 3) list.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)
  for (let i = start; i <= end; i++) {
    list.push(i)
  }

  if (current < totalPages - 2) list.push('...')
  list.push(totalPages)

  return list
})

function goToPage(page) {
  if (typeof page !== 'number' || page < 1 || page > props.lastPage || page === props.currentPage) {
    return
  }
  emit('change', page)
}
</script>

<template>
  <div
    v-if="lastPage > 1"
    class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4"
  >
    <p class="text-xs text-[#737373] tabular-nums">
      Halaman <span class="font-medium text-[#171717]">{{ currentPage }}</span> dari
      <span class="font-medium text-[#171717]">{{ lastPage }}</span>
      <span v-if="total > 0"> ({{ total }} total karya)</span>
    </p>

    <nav class="flex items-center gap-1" aria-label="Navigasi halaman">
      <button
        type="button"
        :disabled="currentPage <= 1"
        class="inline-flex h-9 items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-2.5 text-xs font-medium text-[#171717] hover:bg-[#f8f9fc] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        @click="goToPage(currentPage - 1)"
      >
        <Icon icon="solar:alt-arrow-left-linear" class="h-4 w-4" />
        <span class="hidden sm:inline">Sebelumnya</span>
      </button>

      <template v-for="(item, idx) in pages" :key="`${item}-${idx}`">
        <span
          v-if="item === '...'"
          class="px-2 text-xs text-[#737373] select-none"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          :aria-current="item === currentPage ? 'page' : undefined"
          :class="[
            'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-xs font-medium tabular-nums transition-colors cursor-pointer',
            item === currentPage
              ? 'border-[#2b39ff] bg-[#2b39ff] text-white'
              : 'border-[#e5e7eb] bg-white text-[#171717] hover:bg-[#f8f9fc]',
          ]"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        :disabled="currentPage >= lastPage"
        class="inline-flex h-9 items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-2.5 text-xs font-medium text-[#171717] hover:bg-[#f8f9fc] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        @click="goToPage(currentPage + 1)"
      >
        <span class="hidden sm:inline">Berikutnya</span>
        <Icon icon="solar:alt-arrow-right-linear" class="h-4 w-4" />
      </button>
    </nav>
  </div>
</template>

