<template>
  <button
    :class="[
      'relative px-6 py-3 rounded-xl font-semibold transition-all duration-200',
      'hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses,
      sizeClasses,
    ]"
    :disabled="loading || disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{{ loadingText || 'Loading...' }}</span>
    </span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  disabled?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  const variants = {
    primary: 'gradient-primary text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',
    secondary: 'gradient-secondary text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
    success: 'gradient-success text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
    ghost: 'glass hover:bg-white/10 text-white',
  }
  return variants[props.variant || 'primary']
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  return sizes[props.size || 'md']
})
</script>
