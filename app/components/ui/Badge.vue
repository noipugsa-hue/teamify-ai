<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200',
      sizeClasses,
      variantClasses,
      { 'cursor-pointer hover:scale-105': removable }
    ]"
  >
    <component :is="icon" v-if="icon" :class="iconSizeClasses" />
    <span>{{ label }}</span>
    <button
      v-if="removable"
      type="button"
      class="hover:bg-white/20 rounded-full p-0.5 transition-colors"
      @click="$emit('remove')"
    >
      <svg
        class="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  label: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: Component
  removable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  removable: false
})

defineEmits<{
  remove: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  return sizes[props.size]
})

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    secondary: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
  }
  return variants[props.variant]
})
</script>
