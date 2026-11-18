<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import StatCard from '@/components/layout/StatCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import artworkService from '@/services/artworkService'
import { extractApiErrors, formatDate, formatNumber } from '@/utils/formatters'

const loading = ref(true)
const error = ref(null)
const stats = ref({
  total_artworks: 0,
  total_likes: 0,
  total_participants: 0,
  recent_artworks_count: 0,
})
const recentArtworks = ref([])
const topArtworks = ref([])

async function loadDashboard() {
  loading.value = true
  error.value = null
  try {
    const data = await artworkService.fetchAdminDashboard()
    stats.value = data.stats
    recentArtworks.value = data.recent_artworks || []
    topArtworks.value = data.top_artworks || []
  } catch (err) {
    error.value = extractApiErrors(err, 'Gagal memuat ringkasan dashboard.').message
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <AdminLayout
    title="Overview"
    description="Ringkasan aktivitas pengumpulan karya dan apresiasi peserta pelatihan."
  >
    <div class="space-y-6">
      <!-- Page Title & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-[#09090b]">
            Overview
          </h1>
          <p class="mt-0.5 text-sm text-[#71717a]">
            Pantau statistik karya, total apresiasi, serta karya terfavorit secara real-time.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <AppButton variant="outline" size="sm" :disabled="loading" @click="loadDashboard">
            <Icon icon="solar:refresh-linear" :class="['h-4 w-4', loading ? 'animate-spin' : '']" />
            Segarkan
          </AppButton>
          <RouterLink to="/admin/artworks">
            <AppButton variant="primary" size="sm">
              <Icon icon="solar:gallery-linear" class="h-4 w-4" />
              Kelola Karya
            </AppButton>
          </RouterLink>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" @retry="loadDashboard" />

      <template v-else>
        <!-- Stats Row -->
        <LoadingState v-if="loading" variant="cards" />
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Karya"
            :value="stats.total_artworks"
            caption="Seluruh karya tersimpan di galeri"
            icon="solar:gallery-linear"
          />
          <StatCard
            label="Total Like"
            :value="stats.total_likes"
            caption="Akumulasi apresiasi pengunjung"
            icon="solar:heart-linear"
            highlight
          />
          <StatCard
            label="Total Peserta"
            :value="stats.total_participants"
            caption="Kontributor unik yang mengunggah"
            icon="solar:users-group-rounded-linear"
          />
          <StatCard
            label="Karya Terbaru"
            :value="stats.recent_artworks_count"
            caption="Unggahan dalam 7 hari terakhir"
            icon="solar:clock-circle-linear"
          />
        </div>

        <!-- Secondary Grid: Recent & Top Liked -->
        <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Recent Artworks Card -->
          <section class="lg:col-span-7 rounded-xl border border-[#e4e4e7] bg-white overflow-hidden">
            <div class="flex items-center justify-between gap-4 border-b border-[#e4e4e7] px-5 py-4">
              <div>
                <h2 class="text-sm font-semibold text-[#09090b]">
                  Karya Terbaru
                </h2>
                <p class="text-xs text-[#71717a] mt-0.5">
                  Unggahan peserta paling akhir masuk ke sistem.
                </p>
              </div>
              <RouterLink
                to="/admin/artworks"
                class="inline-flex items-center gap-1 text-xs font-medium text-[#2b39ff] hover:underline"
              >
                Lihat semua
                <Icon icon="solar:arrow-right-linear" class="h-3.5 w-3.5" />
              </RouterLink>
            </div>

            <div v-if="recentArtworks.length === 0" class="p-6">
              <EmptyState
                title="Belum Ada Karya Masuk"
                description="Karya yang diunggah peserta akan langsung muncul di sini."
              />
            </div>

            <div v-else class="divide-y divide-[#f4f4f5]">
              <div
                v-for="item in recentArtworks"
                :key="item.id"
                class="flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#fafafa] transition-colors"
              >
                <img
                  :src="item.image_url"
                  :alt="item.title"
                  class="h-12 w-10 rounded-md border border-[#e4e4e7] object-cover bg-[#f4f4f5] shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-[#09090b] truncate">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-[#71717a] truncate mt-0.5">
                    {{ item.participant_name }} &middot; {{ formatDate(item.created_at) }}
                  </p>
                </div>
                <span class="inline-flex items-center gap-1 rounded-md border border-[#e4e4e7] bg-[#fafafa] px-2.5 py-1 text-xs font-medium text-[#171717] tabular-nums shrink-0">
                  <Icon icon="solar:heart-linear" class="h-3.5 w-3.5 text-[#2b39ff]" />
                  {{ formatNumber(item.likes_count) }}
                </span>
              </div>
            </div>
          </section>

          <!-- Top Liked Artworks Card -->
          <section class="lg:col-span-5 rounded-xl border border-[#e4e4e7] bg-white overflow-hidden">
            <div class="flex items-center justify-between gap-4 border-b border-[#e4e4e7] px-5 py-4">
              <div>
                <h2 class="text-sm font-semibold text-[#09090b]">
                  Like Terbanyak
                </h2>
                <p class="text-xs text-[#71717a] mt-0.5">
                  Ringkasan peringkat karya paling diapresiasi.
                </p>
              </div>
              <Icon icon="solar:crown-linear" class="h-4 w-4 text-[#71717a]" />
            </div>

            <div v-if="topArtworks.length === 0" class="p-6">
              <EmptyState
                title="Belum Ada Peringkat"
                description="Belum terdapat karya yang dapat diranking."
              />
            </div>

            <div v-else class="divide-y divide-[#f4f4f5]">
              <div
                v-for="(item, index) in topArtworks"
                :key="item.id"
                class="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafafa] transition-colors"
              >
                <span
                  :class="[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums',
                    index === 0
                      ? 'bg-[#faf628] text-[#171717]'
                      : 'border border-[#e4e4e7] bg-[#fafafa] text-[#52525b]',
                  ]"
                >
                  {{ index + 1 }}
                </span>

                <img
                  :src="item.image_url"
                  :alt="item.title"
                  class="h-10 w-10 rounded-md border border-[#e4e4e7] object-cover bg-[#f4f4f5] shrink-0"
                />

                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-[#09090b] truncate">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-[#71717a] truncate">
                    {{ item.participant_name }}
                  </p>
                </div>

                <span class="inline-flex items-center gap-1 rounded-full bg-[#eef0ff] px-2.5 py-1 text-xs font-semibold text-[#2b39ff] tabular-nums shrink-0">
                  <Icon icon="solar:heart-bold" class="h-3 w-3" />
                  {{ formatNumber(item.likes_count) }}
                </span>
              </div>
            </div>
          </section>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

