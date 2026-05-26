<template>
  <div class="card-premium relative overflow-hidden">
    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 blur-3xl" />

    <div class="relative z-10">
      <div class="flex items-start justify-between mb-3">
        <div class="p-2 rounded-xl bg-white/10">
          <component :is="icon" :size="24" class="text-purple-400" />
        </div>

        <div v-if="change" :class="[
          'px-2 py-1 rounded-lg text-xs font-medium',
          changePositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        ]">
          {{ changePositive ? '+' : '' }}{{ change }}%
        </div>
      </div>

      <div class="space-y-1">
        <p class="text-3xl font-bold text-white">{{ value }}</p>
        <p class="text-sm text-gray-400">{{ label }}</p>
      </div>

      <div v-if="subtitle" class="mt-4 pt-4 border-t border-white/10">
        <p class="text-xs text-gray-500">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps<{
  icon: any
  label: string
  value: string | number
  change?: number
  subtitle?: string
}>()

const changePositive = computed(() => (props.change || 0) > 0)
</script>
