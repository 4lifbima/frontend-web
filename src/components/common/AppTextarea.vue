<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
  maxlength: {
    type: Number,
    default: 2000,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const generatedId = useId()
const textareaId = computed(() => props.id || `textarea-${generatedId}`)
</script>

<template>
  <div class="space-y-1.5">
    <div v-if="label" class="flex items-center justify-between gap-2">
      <label :for="textareaId" class="block text-sm font-medium text-[#171717]">
        {{ label }}
      </label>
      <span class="text-xs text-[#737373] tabular-nums">
        {{ modelValue.length }} / {{ maxlength }}
      </span>
    </div>

    <textarea
      :id="textareaId"
      :value="modelValue"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :class="[
        'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-[#a1a1aa] transition-colors duration-150 focus:outline-none resize-y disabled:bg-[#f8f9fc] disabled:text-[#737373] disabled:cursor-not-allowed',
        error
          ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/15'
          : 'border-[#e5e7eb] hover:border-[#d4d4d8] focus:border-[#2b39ff] focus:ring-2 focus:ring-[#2b39ff]/15',
      ]"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <p v-if="error" class="text-xs font-medium text-[#dc2626]">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-[#737373]">
      {{ hint }}
    </p>
  </div>
</template>
