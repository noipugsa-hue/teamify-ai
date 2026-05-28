<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Select Container -->
    <div class="relative">
      <!-- Leading Icon -->
      <div
        v-if="leadingIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="leadingIcon" class="h-5 w-5 text-gray-400" />
      </div>

      <!-- Select Field -->
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'block w-full rounded-xl border transition-all duration-200',
          'text-white appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
          disabled ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-gray-800/50',
          error ? 'border-red-500' : 'border-gray-700',
          leadingIcon ? 'pl-10' : 'pl-4',
          'pr-10',
          sizeClasses
        ]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled selected>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Chevron Icon -->
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
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

export interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  helper?: string
  disabled?: boolean
  required?: boolean
  leadingIcon?: Component
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  size: 'md'
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).slice(2, 9)}`)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-base',
    lg: 'py-4 text-lg'
  }
  return sizes[props.size]
})
</script>
