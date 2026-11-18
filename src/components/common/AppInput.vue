<script setup>
import { computed, useId } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
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
  type: {
    type: String,
    default: 'text',
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
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: undefined,
  },
  leadingIcon: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const generatedId = useId()
const inputId = computed(() => props.id || `input-${generatedId}`)
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-[#171717]"
    >
      {{ label }}
      <span v-if="required" class="text-[#dc2626] ml-0.5">*</span>
    </label>

    <div class="relative flex items-center">
      <Icon
        v-if="leadingIcon"
        :icon="leadingIcon"
        class="pointer-events-none absolute left-3 h-4 w-4 text-[#737373]"
        aria-hidden="true"
      />
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="Boolean(error)"
        :class="[
          'w-full h-10 rounded-lg border bg-white text-sm text-[#171717] placeholder:text-[#a1a1aa] transition-colors duration-150 focus:outline-none disabled:bg-[#f8f9fc] disabled:text-[#737373] disabled:cursor-not-allowed',
          leadingIcon ? 'pl-9' : 'pl-3.5',
          $slots.trailing ? 'pr-10' : 'pr-3.5',
          error
            ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/15'
            : 'border-[#e5e7eb] hover:border-[#d4d4d8] focus:border-[#2b39ff] focus:ring-2 focus:ring-[#2b39ff]/15',
        ]"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur', $event)"
      />
      <div v-if="$slots.trailing" class="absolute right-2 flex items-center">
        <slot name="trailing" />
      </div>
    </div>

    <p v-if="error" class="text-xs font-medium text-[#dc2626]">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-[#737373]">
      {{ hint }}
    </p>
  </div>
</template>
