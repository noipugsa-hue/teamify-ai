<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="textareaId"
      class="block text-sm font-medium text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Textarea Field -->
    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxLength"
      :class="[
        'block w-full px-4 py-3 rounded-xl border transition-all duration-200',
        'text-white placeholder-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
        'resize-none',
        disabled ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-gray-800/50',
        error ? 'border-red-500' : 'border-gray-700'
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    ></textarea>

    <!-- Character Count -->
    <div
      v-if="maxLength"
      class="mt-2 flex justify-between items-center text-sm"
    >
      <p v-if="error" class="text-red-500">
        {{ error }}
      </p>
      <p v-else-if="helper" class="text-gray-400">
        {{ helper }}
      </p>
      <span
        :class="[
          'ml-auto',
          characterCount > maxLength * 0.9 ? 'text-yellow-500' : 'text-gray-400'
        ]"
      >
        {{ characterCount }} / {{ maxLength }}
      </span>
    </div>
    <div v-else>
      <p v-if="error" class="mt-2 text-sm text-red-500">
        {{ error }}
      </p>
      <p v-else-if="helper" class="mt-2 text-sm text-gray-400">
        {{ helper }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  helper?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const textareaId = computed(() => `textarea-${Math.random().toString(36).slice(2, 9)}`)

const characterCount = computed(() => props.modelValue?.length || 0)
</script>
