<script setup>
defineProps({
  variant: {
    type: String,
    default: 'grid', // grid | table | cards
  },
  count: {
    type: Number,
    default: 6,
  },
})
</script>

<template>
  <div v-if="variant === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="n in count"
      :key="n"
      class="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden animate-pulse"
    >
      <div class="aspect-[4/5] bg-[#f4f4f5]" />
      <div class="p-4 space-y-2.5">
        <div class="h-3.5 w-1/3 rounded bg-[#f4f4f5]" />
        <div class="h-4 w-4/5 rounded bg-[#e4e4e7]" />
        <div class="pt-1 flex items-center justify-between">
          <div class="h-3 w-1/4 rounded bg-[#f4f4f5]" />
          <div class="h-8 w-16 rounded-lg bg-[#f4f4f5]" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="variant === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <div
      v-for="n in 4"
      :key="n"
      class="rounded-xl border border-[#e4e4e7] bg-white p-5 space-y-3 animate-pulse"
    >
      <div class="flex items-center justify-between">
        <div class="h-3.5 w-24 rounded bg-[#f4f4f5]" />
        <div class="h-8 w-8 rounded-lg bg-[#f4f4f5]" />
      </div>
      <div class="h-8 w-16 rounded bg-[#e4e4e7]" />
      <div class="h-3 w-32 rounded bg-[#f4f4f5]" />
    </div>
  </div>

  <div v-else class="space-y-3 animate-pulse">
    <div
      v-for="n in count"
      :key="n"
      class="flex items-center gap-4 rounded-lg border border-[#e4e4e7] bg-white p-3.5"
    >
      <div class="h-12 w-10 rounded-md bg-[#f4f4f5] shrink-0" />
      <div class="flex-1 space-y-2">
        <div class="h-4 w-1/2 rounded bg-[#e4e4e7]" />
        <div class="h-3 w-1/4 rounded bg-[#f4f4f5]" />
      </div>
      <div class="h-8 w-20 rounded-lg bg-[#f4f4f5]" />
    </div>
  </div>
</template>

