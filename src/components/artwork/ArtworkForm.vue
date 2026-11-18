<script setup>
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import AppInput from '@/components/common/AppInput.vue'
import AppTextarea from '@/components/common/AppTextarea.vue'
import AppButton from '@/components/common/AppButton.vue'
import ArtworkPreview from './ArtworkPreview.vue'
import {
  ALLOWED_IMAGE_EXTENSIONS_LABEL,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_LABEL,
} from '@/utils/constants'

const props = defineProps({
  mode: {
    type: String,
    default: 'create', // create | edit
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  uploadProgress: {
    type: Number,
    default: 0,
  },
  serverErrors: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['submit', 'cancel'])

const fileInputRef = ref(null)
const isDragging = ref(false)
const objectPreviewUrl = ref('')
const selectedFile = ref(null)

const form = reactive({
  participant_name: props.initialData?.participant_name || '',
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
})

const localErrors = reactive({
  participant_name: '',
  title: '',
  description: '',
  image: '',
})

watch(
  () => props.initialData,
  (next) => {
    if (!next) return
    form.participant_name = next.participant_name || ''
    form.title = next.title || ''
    form.description = next.description || ''
    clearSelectedFile()
  },
  { deep: true },
)

const previewSource = computed(() => {
  if (objectPreviewUrl.value) return objectPreviewUrl.value
  if (props.mode === 'edit' && props.initialData?.image_url) {
    return props.initialData.image_url
  }
  return ''
})

const fileSizeLabel = computed(() => {
  if (!selectedFile.value) {
    return props.mode === 'edit' ? 'Gambar saat ini' : ''
  }
  const kb = selectedFile.value.size / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
})

function fieldError(field) {
  return localErrors[field] || props.serverErrors?.[field] || ''
}

function revokePreview() {
  if (objectPreviewUrl.value) {
    URL.revokeObjectURL(objectPreviewUrl.value)
    objectPreviewUrl.value = ''
  }
}

function clearSelectedFile() {
  revokePreview()
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function validateAndSetFile(file) {
  localErrors.image = ''
  if (!file) return

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    localErrors.image = `Format file harus ${ALLOWED_IMAGE_EXTENSIONS_LABEL}.`
    return
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    localErrors.image = `Ukuran gambar melebihi batas maksimal ${MAX_IMAGE_SIZE_LABEL}.`
    return
  }

  revokePreview()
  selectedFile.value = file
  objectPreviewUrl.value = URL.createObjectURL(file)
}

function openFilePicker() {
  if (props.submitting) return
  fileInputRef.value?.click()
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  validateAndSetFile(file)
}

function onDrop(event) {
  isDragging.value = false
  if (props.submitting) return
  const file = event.dataTransfer?.files?.[0]
  validateAndSetFile(file)
}

function validateForm() {
  localErrors.participant_name = ''
  localErrors.title = ''
  localErrors.description = ''
  localErrors.image = ''

  let valid = true

  const participant = form.participant_name.trim()
  if (!participant) {
    localErrors.participant_name = 'Nama peserta wajib diisi.'
    valid = false
  } else if (participant.length < 2) {
    localErrors.participant_name = 'Nama peserta minimal 2 karakter.'
    valid = false
  }

  const title = form.title.trim()
  if (!title) {
    localErrors.title = 'Judul karya wajib diisi.'
    valid = false
  } else if (title.length < 2) {
    localErrors.title = 'Judul karya minimal 2 karakter.'
    valid = false
  }

  if (props.mode === 'create' && !selectedFile.value) {
    localErrors.image = 'Silakan pilih gambar karya untuk diunggah.'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validateForm()) return

  const payload = new FormData()
  payload.append('participant_name', form.participant_name.trim())
  payload.append('title', form.title.trim())
  payload.append('description', form.description.trim())
  if (selectedFile.value) {
    payload.append('image', selectedFile.value)
  }

  emit('submit', payload)
}

function resetForm() {
  form.participant_name = ''
  form.title = ''
  form.description = ''
  localErrors.participant_name = ''
  localErrors.title = ''
  localErrors.description = ''
  localErrors.image = ''
  clearSelectedFile()
}

defineExpose({ resetForm })

onUnmounted(() => {
  revokePreview()
})
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
    <AppInput
      v-model="form.participant_name"
      label="Nama Peserta"
      placeholder="Contoh: Nadia Kusuma"
      :error="fieldError('participant_name')"
      :disabled="submitting"
      required
    />

    <AppInput
      v-model="form.title"
      label="Judul Karya"
      placeholder="Contoh: Poster Pameran Tipografi Modern"
      :error="fieldError('title')"
      :disabled="submitting"
      required
    />

    <AppTextarea
      v-model="form.description"
      label="Deskripsi (Opsional)"
      placeholder="Ceritakan konsep, pendekatan visual, atau alat yang digunakan..."
      :rows="4"
      :error="fieldError('description')"
      :disabled="submitting"
    />

    <div class="space-y-2">
      <label class="block text-sm font-medium text-[#171717]">
        Gambar Karya
        <span v-if="mode === 'create'" class="text-[#dc2626] ml-0.5">*</span>
      </label>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="onFileChange"
      />

      <ArtworkPreview
        v-if="previewSource"
        :src="previewSource"
        :file-name="selectedFile?.name"
        :file-size-label="fileSizeLabel"
        :allow-remove="mode === 'create' || Boolean(selectedFile)"
        :disabled="submitting"
        @replace="openFilePicker"
        @remove="clearSelectedFile"
      />

      <div
        v-else
        role="button"
        tabindex="0"
        :class="[
          'flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b39ff]/25',
          isDragging
            ? 'border-[#2b39ff] bg-[#eef0ff]/60'
            : fieldError('image')
              ? 'border-[#dc2626] bg-[#fef2f2]/30'
              : 'border-[#d4d4d8] bg-[#f8f9fc] hover:border-[#2b39ff] hover:bg-[#eef0ff]/30',
        ]"
        @click="openFilePicker"
        @keydown.enter.prevent="openFilePicker"
        @keydown.space.prevent="openFilePicker"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#2b39ff] mb-3">
          <Icon icon="solar:cloud-upload-linear" class="h-6 w-6" />
        </div>
        <p class="text-sm font-medium text-[#171717]">
          Tarik & letakkan gambar di sini, atau
          <span class="text-[#2b39ff] underline underline-offset-2">pilih file</span>
        </p>
        <p class="mt-1 text-xs text-[#737373]">
          Format {{ ALLOWED_IMAGE_EXTENSIONS_LABEL }} — Maksimal {{ MAX_IMAGE_SIZE_LABEL }}
        </p>
      </div>

      <p v-if="fieldError('image')" class="text-xs font-medium text-[#dc2626]">
        {{ fieldError('image') }}
      </p>
    </div>

    <div v-if="submitting && uploadProgress > 0 && uploadProgress < 100" class="space-y-1">
      <div class="flex items-center justify-between text-xs text-[#737373]">
        <span>Mengunggah karya...</span>
        <span class="tabular-nums font-medium text-[#171717]">{{ uploadProgress }}%</span>
      </div>
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <div
          class="h-full bg-[#2b39ff] transition-all duration-150"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
    </div>

    <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
      <AppButton
        v-if="mode === 'edit'"
        variant="outline"
        :disabled="submitting"
        @click="emit('cancel')"
      >
        Batal
      </AppButton>
      <AppButton
        type="submit"
        variant="primary"
        :full-width="mode === 'create'"
        :loading="submitting"
      >
        <Icon
          v-if="!submitting"
          :icon="mode === 'create' ? 'solar:upload-linear' : 'solar:check-circle-linear'"
          class="h-4 w-4"
        />
        {{ mode === 'create' ? 'Kirim Karya Sekarang' : 'Simpan Perubahan' }}
      </AppButton>
    </div>
  </form>
</template>

