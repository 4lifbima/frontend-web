<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import ArtworkForm from '@/components/artwork/ArtworkForm.vue'
import artworkService from '@/services/artworkService'
import { useToast } from '@/composables/useToast'
import { extractApiErrors, formatDate, formatDateTime, formatNumber } from '@/utils/formatters'

const toast = useToast()

const artworks = ref([])
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})
const loading = ref(true)
const error = ref(null)

const filters = reactive({
  search: '',
  sort: 'newest',
  filter: 'all',
  page: 1,
})

const detailArtwork = ref(null)
const editingArtwork = ref(null)
const editSubmitting = ref(false)
const editErrors = ref({})

const deletingArtwork = ref(null)
const deleteSubmitting = ref(false)

let searchDebounce = null

async function loadArtworks() {
  loading.value = true
  error.value = null
  try {
    const data = await artworkService.fetchAdminArtworks({
      page: filters.page,
      perPage: 10,
      search: filters.search.trim(),
      sort: filters.sort,
      filter: filters.filter,
    })
    artworks.value = data.items || []
    meta.value = data.meta || {
      current_page: filters.page,
      last_page: 1,
      per_page: 10,
      total: artworks.value.length,
    }
  } catch (err) {
    error.value = extractApiErrors(err, 'Gagal memuat daftar karya.').message
  } finally {
    loading.value = false
  }
}

watch(
  () => filters.search,
  () => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      filters.page = 1
      loadArtworks()
    }, 350)
  },
)

watch(
  () => [filters.sort, filters.filter],
  () => {
    filters.page = 1
    loadArtworks()
  },
)

function handlePageChange(nextPage) {
  filters.page = nextPage
  loadArtworks()
}

function openEditModal(artwork) {
  editErrors.value = {}
  editingArtwork.value = artwork
}

async function handleUpdateSubmit(formData) {
  if (!editingArtwork.value) return
  editSubmitting.value = true
  editErrors.value = {}

  try {
    const response = await artworkService.updateAdminArtwork(editingArtwork.value.id, formData)
    toast.success(response.message || 'Karya berhasil diperbarui.')
    editingArtwork.value = null
    await loadArtworks()
  } catch (err) {
    const parsed = extractApiErrors(err, 'Gagal memperbarui informasi karya.')
    editErrors.value = parsed.fieldErrors
    toast.error(parsed.message)
  } finally {
    editSubmitting.value = false
  }
}

async function handleDeleteConfirm() {
  if (!deletingArtwork.value) return
  deleteSubmitting.value = true

  try {
    await artworkService.deleteAdminArtwork(deletingArtwork.value.id)
    toast.success(`Karya "${deletingArtwork.value.title}" berhasil dihapus.`)
    deletingArtwork.value = null

    if (artworks.value.length === 1 && filters.page > 1) {
      filters.page -= 1
    }
    await loadArtworks()
  } catch (err) {
    toast.error(extractApiErrors(err, 'Gagal menghapus karya.').message)
  } finally {
    deleteSubmitting.value = false
  }
}

function resetFilters() {
  filters.search = ''
  filters.sort = 'newest'
  filters.filter = 'all'
  filters.page = 1
  loadArtworks()
}

onMounted(loadArtworks)

onUnmounted(() => {
  clearTimeout(searchDebounce)
})
</script>

<template>
  <AdminLayout
    title="Kelola Karya"
    description="Cari, filter, tinjau, edit, atau hapus karya peserta pelatihan."
  >
    <div class="space-y-6">
      <!-- Page Title -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-2xl font-bold tracking-tight text-[#09090b]">
                Kelola Karya
              </h1>
              <span class="rounded-full border border-[#e4e4e7] bg-white px-2.5 py-0.5 text-xs font-medium text-[#52525b] tabular-nums">
                {{ formatNumber(meta.total) }} item
              </span>
            </div>
            <p class="mt-0.5 text-sm text-[#71717a]">
              Daftar seluruh karya desain peserta beserta statistik apresiasi.
            </p>
          </div>
        </div>

        <AppButton variant="outline" size="sm" :disabled="loading" @click="loadArtworks">
          <Icon icon="solar:refresh-linear" :class="['h-4 w-4', loading ? 'animate-spin' : '']" />
          Muat Ulang
        </AppButton>
      </div>

      <!-- Shadcn Filter & Search Toolbar -->
      <div class="rounded-xl border border-[#e4e4e7] bg-white p-4">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div class="md:col-span-5">
            <AppInput
              v-model="filters.search"
              placeholder="Cari nama peserta atau judul karya..."
              leading-icon="solar:magnifier-linear"
            >
              <template v-if="filters.search" #trailing>
                <button
                  type="button"
                  class="text-[#71717a] hover:text-[#09090b] p-1 cursor-pointer"
                  aria-label="Hapus kata kunci"
                  @click="filters.search = ''"
                >
                  <Icon icon="solar:close-circle-linear" class="h-4 w-4" />
                </button>
              </template>
            </AppInput>
          </div>

          <div class="md:col-span-3">
            <div class="relative">
              <Icon
                icon="solar:filter-linear"
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]"
              />
              <select
                v-model="filters.filter"
                aria-label="Filter karya"
                class="h-10 w-full appearance-none rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-8 text-sm text-[#09090b] hover:border-[#d4d4d8] focus:border-[#2b39ff] focus:outline-none focus:ring-2 focus:ring-[#2b39ff]/15 cursor-pointer"
              >
                <option value="all">Semua Karya</option>
                <option value="with_likes">Sudah Ada Like</option>
                <option value="no_likes">Belum Ada Like</option>
                <option value="this_week">7 Hari Terakhir</option>
              </select>
              <Icon
                icon="solar:alt-arrow-down-linear"
                class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]"
              />
            </div>
          </div>

          <div class="md:col-span-4 flex items-center gap-2">
            <div class="relative flex-1">
              <Icon
                icon="solar:sort-vertical-linear"
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]"
              />
              <select
                v-model="filters.sort"
                aria-label="Urutkan karya"
                class="h-10 w-full appearance-none rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-8 text-sm text-[#09090b] hover:border-[#d4d4d8] focus:border-[#2b39ff] focus:outline-none focus:ring-2 focus:ring-[#2b39ff]/15 cursor-pointer"
              >
                <option value="newest">Terbaru Diunggah</option>
                <option value="oldest">Terlama Diunggah</option>
                <option value="most_liked">Like Terbanyak</option>
                <option value="least_liked">Like Terdikit</option>
              </select>
              <Icon
                icon="solar:alt-arrow-down-linear"
                class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]"
              />
            </div>

            <AppButton
              v-if="filters.search || filters.filter !== 'all' || filters.sort !== 'newest'"
              variant="ghost"
              size="sm"
              @click="resetFilters"
            >
              Reset
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Content States -->
      <LoadingState v-if="loading" variant="table" :count="5" />

      <ErrorState v-else-if="error" :message="error" @retry="loadArtworks" />

      <EmptyState
        v-else-if="artworks.length === 0"
        title="Tidak Ada Karya Ditemukan"
        description="Coba ubah kata kunci pencarian atau setel ulang filter untuk melihat karya lainnya."
      >
        <template #action>
          <AppButton variant="outline" size="sm" @click="resetFilters">
            Tampilkan Semua Karya
          </AppButton>
        </template>
      </EmptyState>

      <template v-else>
        <!-- Desktop Shadcn Data Table -->
        <div class="hidden md:block rounded-xl border border-[#e4e4e7] bg-white overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-[#e4e4e7] bg-[#fafafa]">
                  <th class="px-4 py-3 text-xs font-medium text-[#71717a] uppercase tracking-wider w-20">
                    Preview
                  </th>
                  <th class="px-4 py-3 text-xs font-medium text-[#71717a] uppercase tracking-wider">
                    Nama Peserta
                  </th>
                  <th class="px-4 py-3 text-xs font-medium text-[#71717a] uppercase tracking-wider">
                    Judul Karya
                  </th>
                  <th class="px-4 py-3 text-xs font-medium text-[#71717a] uppercase tracking-wider w-28">
                    Total Like
                  </th>
                  <th class="px-4 py-3 text-xs font-medium text-[#71717a] uppercase tracking-wider w-36">
                    Tanggal Upload
                  </th>
                  <th class="px-4 py-3 text-xs font-medium text-[#71717a] uppercase tracking-wider text-right w-44">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f4f4f5] text-sm">
                <tr
                  v-for="item in artworks"
                  :key="item.id"
                  class="hover:bg-[#fafafa] transition-colors"
                >
                  <td class="px-4 py-3">
                    <button
                      type="button"
                      class="block h-14 w-11 overflow-hidden rounded-md border border-[#e4e4e7] bg-[#f4f4f5] cursor-pointer"
                      @click="detailArtwork = item"
                    >
                      <img
                        :src="item.image_url"
                        :alt="item.title"
                        class="h-full w-full object-cover"
                      />
                    </button>
                  </td>
                  <td class="px-4 py-3 font-medium text-[#09090b]">
                    {{ item.participant_name }}
                  </td>
                  <td class="px-4 py-3 max-w-xs">
                    <p class="font-medium text-[#09090b] line-clamp-1">
                      {{ item.title }}
                    </p>
                    <p v-if="item.description" class="text-xs text-[#71717a] line-clamp-1 mt-0.5">
                      {{ item.description }}
                    </p>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-1 rounded-full border border-[#e4e4e7] bg-[#fafafa] px-2.5 py-0.5 text-xs font-semibold text-[#09090b] tabular-nums">
                      <Icon icon="solar:heart-bold" class="h-3.5 w-3.5 text-[#2b39ff]" />
                      {{ formatNumber(item.likes_count) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-[#71717a] tabular-nums whitespace-nowrap">
                    {{ formatDate(item.created_at) }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e4e4e7] bg-white text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#09090b] transition-colors cursor-pointer"
                        title="Lihat Detail"
                        aria-label="Lihat Detail"
                        @click="detailArtwork = item"
                      >
                        <Icon icon="solar:eye-linear" class="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e4e4e7] bg-white text-[#52525b] hover:border-[#2b39ff]/40 hover:bg-[#eef0ff] hover:text-[#2b39ff] transition-colors cursor-pointer"
                        title="Edit Karya"
                        aria-label="Edit Karya"
                        @click="openEditModal(item)"
                      >
                        <Icon icon="solar:pen-linear" class="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e4e4e7] bg-white text-[#dc2626] hover:border-[#fecaca] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                        title="Hapus Karya"
                        aria-label="Hapus Karya"
                        @click="deletingArtwork = item"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Responsive Card List (DESIGN.md Section 12) -->
        <div class="md:hidden space-y-3">
          <div
            v-for="item in artworks"
            :key="item.id"
            class="rounded-xl border border-[#e4e4e7] bg-white p-4 space-y-3"
          >
            <div class="flex items-start gap-3">
              <img
                :src="item.image_url"
                :alt="item.title"
                class="h-20 w-16 rounded-lg border border-[#e4e4e7] object-cover bg-[#f4f4f5] shrink-0"
              />
              <div class="min-w-0 flex-1 space-y-1">
                <p class="text-xs font-medium text-[#71717a]">
                  {{ item.participant_name }}
                </p>
                <h3 class="text-sm font-semibold text-[#09090b] line-clamp-2">
                  {{ item.title }}
                </h3>
                <div class="flex items-center gap-3 pt-1">
                  <span class="inline-flex items-center gap-1 rounded-full bg-[#eef0ff] px-2 py-0.5 text-xs font-semibold text-[#2b39ff] tabular-nums">
                    <Icon icon="solar:heart-bold" class="h-3 w-3" />
                    {{ formatNumber(item.likes_count) }}
                  </span>
                  <span class="text-xs text-[#71717a]">
                    {{ formatDate(item.created_at) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#f4f4f5]">
              <AppButton variant="outline" size="sm" @click="detailArtwork = item">
                <Icon icon="solar:eye-linear" class="h-3.5 w-3.5" />
                Detail
              </AppButton>
              <AppButton variant="outline" size="sm" @click="openEditModal(item)">
                <Icon icon="solar:pen-linear" class="h-3.5 w-3.5" />
                Edit
              </AppButton>
              <AppButton
                variant="outline"
                size="sm"
                class="text-[#dc2626] border-[#fecaca] hover:bg-[#fef2f2]"
                @click="deletingArtwork = item"
              >
                <Icon icon="solar:trash-bin-trash-linear" class="h-3.5 w-3.5" />
                Hapus
              </AppButton>
            </div>
          </div>
        </div>

        <AppPagination
          :current-page="meta.current_page"
          :last-page="meta.last_page"
          :total="meta.total"
          @change="handlePageChange"
        />
      </template>
    </div>

    <!-- Detail Modal -->
    <AppModal
      :open="Boolean(detailArtwork)"
      max-width="max-w-2xl"
      title="Detail Karya Peserta"
      :description="detailArtwork ? `Diunggah pada ${formatDateTime(detailArtwork.created_at)}` : ''"
      @close="detailArtwork = null"
    >
      <div v-if="detailArtwork" class="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
        <div class="sm:col-span-6 rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-2 flex items-center justify-center">
          <img
            :src="detailArtwork.image_url"
            :alt="detailArtwork.title"
            class="max-h-80 w-full rounded object-contain bg-white"
          />
        </div>

        <div class="sm:col-span-6 space-y-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-[#71717a]">Judul Karya</p>
            <p class="mt-1 text-base font-semibold text-[#09090b]">{{ detailArtwork.title }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-[#71717a]">Nama Peserta</p>
            <p class="mt-1 text-sm font-medium text-[#09090b]">{{ detailArtwork.participant_name }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-[#71717a]">Total Like</p>
            <p class="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#eef0ff] px-3 py-1 text-xs font-semibold text-[#2b39ff] tabular-nums">
              <Icon icon="solar:heart-bold" class="h-3.5 w-3.5" />
              {{ formatNumber(detailArtwork.likes_count) }} Apresiasi
            </p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-[#71717a]">Deskripsi</p>
            <p class="mt-1 text-sm text-[#52525b] whitespace-pre-line">
              {{ detailArtwork.description || 'Tidak ada deskripsi tambahan.' }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <AppButton variant="outline" size="sm" @click="detailArtwork = null">
          Tutup
        </AppButton>
        <AppButton
          v-if="detailArtwork"
          variant="primary"
          size="sm"
          @click="openEditModal(detailArtwork); detailArtwork = null"
        >
          <Icon icon="solar:pen-linear" class="h-3.5 w-3.5" />
          Edit Karya
        </AppButton>
      </template>
    </AppModal>

    <!-- Edit Modal -->
    <AppModal
      :open="Boolean(editingArtwork)"
      max-width="max-w-xl"
      title="Edit Informasi Karya"
      description="Perbarui data peserta, judul, deskripsi, atau ganti file gambar."
      :close-on-backdrop="!editSubmitting"
      @close="!editSubmitting && (editingArtwork = null)"
    >
      <ArtworkForm
        v-if="editingArtwork"
        mode="edit"
        :initial-data="editingArtwork"
        :submitting="editSubmitting"
        :server-errors="editErrors"
        @submit="handleUpdateSubmit"
        @cancel="editingArtwork = null"
      />
    </AppModal>

    <!-- Delete Confirmation Dialog (DESIGN.md Section 12) -->
    <ConfirmDialog
      :open="Boolean(deletingArtwork)"
      title="Hapus Karya Permanen?"
      :description="deletingArtwork
        ? `Karya &quot;${deletingArtwork.title}&quot; milik ${deletingArtwork.participant_name} akan dihapus dari galeri beserta seluruh data Like terkait secara permanen.`
        : ''"
      confirm-label="Ya, Hapus Karya"
      :loading="deleteSubmitting"
      @close="deletingArtwork = null"
      @confirm="handleDeleteConfirm"
    />
  </AdminLayout>
</template>
