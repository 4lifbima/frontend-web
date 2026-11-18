<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import ArtworkForm from '@/components/artwork/ArtworkForm.vue'
import AppButton from '@/components/common/AppButton.vue'
import artworkService from '@/services/artworkService'
import { useToast } from '@/composables/useToast'
import { extractApiErrors } from '@/utils/formatters'

const toast = useToast()

const formRef = ref(null)
const submitting = ref(false)
const uploadProgress = ref(0)
const serverErrors = ref({})
const uploadedArtwork = ref(null)

async function handleSubmit(formData) {
  submitting.value = true
  uploadProgress.value = 0
  serverErrors.value = {}
  uploadedArtwork.value = null

  try {
    const response = await artworkService.uploadArtwork(formData, (progressEvent) => {
      if (progressEvent.total) {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })

    uploadedArtwork.value = response.data
    formRef.value?.resetForm()
    toast.success('Karya Anda berhasil diunggah dan tampil di katalog.')
  } catch (err) {
    const parsed = extractApiErrors(err, 'Gagal mengunggah karya. Periksa kembali isian Anda.')
    serverErrors.value = parsed.fieldErrors
    toast.error(parsed.message)
  } finally {
    submitting.value = false
    uploadProgress.value = 0
  }
}
</script>

<template>
  <PublicLayout>
    <section class="py-12 sm:py-16 bg-white">
      <div class="mx-auto max-w-2xl px-4 sm:px-6 space-y-8">
        <!-- Header -->
        <div class="space-y-3">
          <RouterLink
            to="/"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-[#737373] hover:text-[#171717] transition-colors"
          >
            <Icon icon="solar:alt-arrow-left-linear" class="h-4 w-4" />
            Kembali ke Katalog
          </RouterLink>

          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
            Bagikan Karyamu
          </h1>
          <p class="text-sm sm:text-base text-[#737373] leading-relaxed">
            Unggah hasil karya desain grafis terbaik Anda agar dapat dilihat dan diapresiasi oleh peserta serta pemateri. Tidak diperlukan akun peserta.
          </p>
        </div>

        <!-- Upload Success Banner -->
        <div
          v-if="uploadedArtwork"
          class="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="flex items-start gap-3">
            <Icon icon="solar:check-circle-linear" class="h-5 w-5 text-[#16a34a] shrink-0 mt-0.5" />
            <div class="space-y-0.5">
              <p class="text-sm font-semibold text-[#171717]">
                "{{ uploadedArtwork.title }}" berhasil dipublikasikan!
              </p>
              <p class="text-xs text-[#52525b]">
                Karya oleh {{ uploadedArtwork.participant_name }} sudah masuk ke katalog publik.
              </p>
            </div>
          </div>
          <RouterLink :to="{ path: '/', hash: '#katalog' }" class="shrink-0">
            <AppButton variant="outline" size="sm">
              Lihat di Katalog
              <Icon icon="solar:arrow-right-linear" class="h-3.5 w-3.5" />
            </AppButton>
          </RouterLink>
        </div>

        <!-- Form Card -->
        <div class="rounded-xl border border-[#e5e7eb] bg-white p-6 sm:p-8">
          <ArtworkForm
            ref="formRef"
            mode="create"
            :submitting="submitting"
            :upload-progress="uploadProgress"
            :server-errors="serverErrors"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

