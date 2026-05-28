<template>
  <div
    :class="[
      'rounded-2xl transition-all duration-300',
      glassEffect ? 'glass-card' : 'bg-gray-800/50 border border-gray-700/50',
      hover && 'hover:scale-[1.02] hover:shadow-2xl cursor-pointer',
      paddingClasses
    ]"
  >
    <!-- Card Header -->
    <div v-if="$slots.header || title" class="border-b border-gray-700/50 pb-4 mb-4">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <component
              :is="icon"
              v-if="icon"
              class="w-6 h-6 text-purple-500"
            />
            <h3 class="text-xl font-bold text-white">{{ title }}</h3>
          </div>
          <slot name="header-actions" />
        </div>
      </slot>
    </div>

    <!-- Card Body -->
    <div>
      <slot />
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="border-t border-gray-700/50 pt-4 mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title?: string
  icon?: Component
  glassEffect?: boolean
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  glassEffect: true,
  hover: false,
  padding: 'md'
})

const paddingClasses = computed(() => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  return paddings[props.padding]
})
</script>

<style scoped>
.glass-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
</style>
