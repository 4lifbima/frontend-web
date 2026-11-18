<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const formError = ref('')
const fieldErrors = reactive({
  email: '',
  password: '',
})

async function handleSubmit() {
  formError.value = ''
  fieldErrors.email = ''
  fieldErrors.password = ''

  if (!form.email.trim()) {
    fieldErrors.email = 'Email administrator wajib diisi.'
  }
  if (!form.password) {
    fieldErrors.password = 'Kata sandi wajib diisi.'
  }
  if (fieldErrors.email || fieldErrors.password) return

  const result = await authStore.login({
    email: form.email.trim(),
    password: form.password,
  })

  if (result.ok) {
    toast.success(`Selamat datang kembali, ${result.user.name}.`)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin/dashboard'
    router.push(redirect)
    return
  }

  fieldErrors.email = result.fieldErrors?.email || ''
  fieldErrors.password = result.fieldErrors?.password || ''
  formError.value = result.message || 'Kredensial tidak valid.'
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-center bg-[#fafafa] px-4 py-12">
    <div class="mx-auto w-full max-w-[400px] space-y-6">
      <!-- Brand -->
      <div class="text-center space-y-3">
        <RouterLink to="/" class="inline-flex items-center justify-center gap-2.5">
          <span class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b39ff] text-white">
            <Icon icon="solar:gallery-linear" class="h-5 w-5" />
            <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#fafafa] bg-[#faf628]" />
          </span>
          <span class="text-lg font-bold tracking-tight text-[#09090b]">
            Upload Karya
          </span>
        </RouterLink>

        <div class="space-y-1">
          <h1 class="text-2xl font-bold tracking-tight text-[#09090b]">
            Selamat Datang Kembali
          </h1>
          <p class="text-sm text-[#71717a]">
            Masuk sebagai pemateri untuk mengelola karya peserta.
          </p>
        </div>
      </div>

      <!-- Shadcn Login Card -->
      <div class="rounded-xl border border-[#e4e4e7] bg-white p-6 sm:p-7">
        <div
          v-if="formError"
          class="mb-5 flex items-start gap-2.5 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3 text-xs font-medium text-[#dc2626]"
          role="alert"
        >
          <Icon icon="solar:danger-triangle-linear" class="h-4 w-4 shrink-0 mt-0.5" />
          <span>{{ formError }}</span>
        </div>

        <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
          <AppInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="pemateri@organisasi.id"
            leading-icon="solar:letter-linear"
            autocomplete="email"
            :error="fieldErrors.email"
            :disabled="authStore.loading"
            required
          />

          <AppInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Masukkan kata sandi"
            leading-icon="solar:lock-keyhole-linear"
            autocomplete="current-password"
            :error="fieldErrors.password"
            :disabled="authStore.loading"
            required
          >
            <template #trailing>
              <button
                type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b] cursor-pointer"
                :aria-label="showPassword ? 'Sembunyikan password' : 'Lihat password'"
                @click="showPassword = !showPassword"
              >
                <Icon
                  :icon="showPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'"
                  class="h-4 w-4"
                />
              </button>
            </template>
          </AppInput>

          <AppButton
            type="submit"
            variant="primary"
            full-width
            :loading="authStore.loading"
            class="mt-2"
          >
            Login ke Dashboard
          </AppButton>
        </form>
      </div>

      <div class="text-center">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717a] hover:text-[#09090b] transition-colors"
        >
          <Icon icon="solar:alt-arrow-left-linear" class="h-4 w-4" />
          Kembali ke Beranda Publik
        </RouterLink>
      </div>
    </div>
  </div>
</template>
