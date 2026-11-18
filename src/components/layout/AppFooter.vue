<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-[#e5e7eb] bg-white">
    <div class="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2 max-w-md">
          <div class="inline-flex items-center gap-2">
            <span class="relative flex h-7 w-7 items-center justify-center rounded-md bg-[#2b39ff] text-white">
              <Icon icon="solar:gallery-linear" class="h-4 w-4" />
              <span class="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-[#faf628]" />
            </span>
            <span class="text-sm font-bold text-[#171717]">Upload Karya</span>
          </div>
          <p class="text-xs sm:text-sm text-[#737373] leading-relaxed">
            Platform galeri digital resmi untuk mengumpulkan, menampilkan, dan mengapresiasi hasil karya peserta pelatihan desain grafis.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-5 text-sm text-[#737373]">
          <RouterLink to="/" class="hover:text-[#171717] transition-colors">
            Beranda
          </RouterLink>
          <RouterLink :to="{ path: '/', hash: '#katalog' }" class="hover:text-[#171717] transition-colors">
            Katalog Karya
          </RouterLink>
          <RouterLink to="/upload" class="hover:text-[#171717] transition-colors">
            Upload Karya
          </RouterLink>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-[#f4f4f5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#737373]">
        <p>&copy; {{ currentYear }} Upload Karya - Bidang Kominfo Desain Grafis.</p>
        <p>Dibangun untuk kreativitas & apresiasi karya peserta.</p>
      </div>
    </div>
  </footer>
</template>

