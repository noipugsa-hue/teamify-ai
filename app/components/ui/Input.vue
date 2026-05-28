<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Leading Icon -->
      <div
        v-if="leadingIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="leadingIcon" class="h-5 w-5 text-gray-400" />
      </div>

      <!-- Input Field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'block w-full rounded-xl border transition-all duration-200',
          'text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
          disabled ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-gray-800/50',
          error ? 'border-red-500' : 'border-gray-700',
          leadingIcon ? 'pl-10' : 'pl-4',
          trailingIcon ? 'pr-10' : 'pr-4',
          sizeClasses
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <!-- Trailing Icon -->
      <div
        v-if="trailingIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component :is="trailingIcon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-500">
      {{ error }}
    </p>

    <!-- Helper Text -->
    <p v-if="helper && !error" class="mt-2 text-sm text-gray-400">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  error?: string
  helper?: string
  disabled?: boolean
  required?: boolean
  leadingIcon?: Component
  trailingIcon?: Component
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md'
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 9)}`)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-base',
    lg: 'py-4 text-lg'
  }
  return sizes[props.size]
})
</script>
