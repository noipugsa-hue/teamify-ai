# Teamify AI - Component Library Documentation

## Overview

This document describes the reusable UI component system for Teamify AI. All components follow a consistent design language with glassmorphism effects, gradients, and premium SaaS styling.

## Design Principles

1. **Consistency**: All components share the same design tokens
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Responsive**: Mobile-first design approach
4. **Themeable**: Support for dark mode (default)
5. **Type-safe**: Full TypeScript support

## Base Components

### GradientButton

Premium gradient button with loading states and icons.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `icon`: Component

**Usage:**
```vue
<template>
  <GradientButton
    variant="primary"
    size="md"
    :loading="isLoading"
    :icon="Sparkles"
    @click="handleClick"
  >
    Generate Content
  </GradientButton>
</template>

<script setup>
import { Sparkles } from 'lucide-vue-next'
import { GradientButton } from '~/components/ui'

const isLoading = ref(false)

const handleClick = async () => {
  isLoading.value = true
  // ... do something
  isLoading.value = false
}
</script>
```

### Card

Flexible card component with glass effect.

**Props:**
- `title`: string (optional)
- `icon`: Component (optional)
- `glassEffect`: boolean (default: true)
- `hover`: boolean (default: false)
- `padding`: 'none' | 'sm' | 'md' | 'lg'

**Slots:**
- `header`: Custom header content
- `default`: Card body content
- `footer`: Card footer content
- `header-actions`: Actions in header (top-right)

**Usage:**
```vue
<template>
  <Card
    title="AI Content Generator"
    :icon="Sparkles"
    glass-effect
    hover
  >
    <template #header-actions>
      <GradientButton size="sm">New</GradientButton>
    </template>

    <!-- Card content -->
    <p>Generate viral content for TikTok...</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <GradientButton variant="ghost">Cancel</GradientButton>
        <GradientButton variant="primary">Generate</GradientButton>
      </div>
    </template>
  </Card>
</template>
```

### Input

Form input field with validation and icons.

**Props:**
- `modelValue`: string | number
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
- `label`: string
- `placeholder`: string
- `error`: string
- `helper`: string
- `disabled`: boolean
- `required`: boolean
- `leadingIcon`: Component
- `trailingIcon`: Component
- `size`: 'sm' | 'md' | 'lg'

**Events:**
- `update:modelValue`: Value changed
- `blur`: Input blur
- `focus`: Input focus

**Usage:**
```vue
<template>
  <Input
    v-model="email"
    type="email"
    label="Email Address"
    placeholder="Enter your email"
    :leading-icon="Mail"
    :error="emailError"
    helper="We'll never share your email"
    required
  />
</template>

<script setup>
import { Mail } from 'lucide-vue-next'

const email = ref('')
const emailError = ref('')
</script>
```

### Textarea

Multi-line text input with character count.

**Props:**
- `modelValue`: string
- `label`: string
- `placeholder`: string
- `error`: string
- `helper`: string
- `disabled`: boolean
- `required`: boolean
- `rows`: number (default: 4)
- `maxLength`: number

**Events:**
- `update:modelValue`: Value changed
- `blur`: Textarea blur
- `focus`: Textarea focus

**Usage:**
```vue
<template>
  <Textarea
    v-model="content"
    label="Content"
    placeholder="Enter your content here..."
    :rows="6"
    :max-length="1000"
    helper="Be creative and engaging"
  />
</template>
```

### Select

Dropdown select field with icons.

**Props:**
- `modelValue`: string | number
- `options`: SelectOption[] (required)
- `label`: string
- `placeholder`: string
- `error`: string
- `helper`: string
- `disabled`: boolean
- `required`: boolean
- `leadingIcon`: Component
- `size`: 'sm' | 'md' | 'lg'

**Types:**
```typescript
interface SelectOption {
  label: string
  value: string | number
}
```

**Usage:**
```vue
<template>
  <Select
    v-model="platform"
    label="Platform"
    :options="platformOptions"
    :leading-icon="Video"
    placeholder="Select a platform"
  />
</template>

<script setup>
import { Video } from 'lucide-vue-next'

const platform = ref('')
const platformOptions = [
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' }
]
</script>
```

### Badge

Tag/badge component for labels and status.

**Props:**
- `label`: string (required)
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: Component
- `removable`: boolean

**Events:**
- `remove`: Badge remove button clicked

**Usage:**
```vue
<template>
  <div class="flex gap-2">
    <Badge label="TikTok" variant="primary" :icon="Video" />
    <Badge label="Viral" variant="success" />
    <Badge label="Draft" variant="warning" removable @remove="handleRemove" />
  </div>
</template>
```

### Modal

Dialog modal component.

**Props:**
- `show`: boolean (required)
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `closeOnBackdrop`: boolean (default: true)

**Events:**
- `close`: Modal close requested

**Slots:**
- `default`: Modal content
- `footer`: Modal footer actions

**Usage:**
```vue
<template>
  <Modal
    :show="showModal"
    title="Generate Content"
    size="lg"
    @close="showModal = false"
  >
    <!-- Modal content -->
    <p>Configure your content generation...</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <GradientButton variant="ghost" @click="showModal = false">
          Cancel
        </GradientButton>
        <GradientButton variant="primary" @click="handleGenerate">
          Generate
        </GradientButton>
      </div>
    </template>
  </Modal>
</template>
```

### StatCard

Statistics card with icon and trend indicator.

**Props:**
- `icon`: Component (required)
- `label`: string (required)
- `value`: string | number (required)
- `change`: number (optional)
- `subtitle`: string (optional)

**Usage:**
```vue
<template>
  <StatCard
    :icon="DollarSign"
    label="Total Revenue"
    :value="formatCurrency(12450)"
    :change="12.5"
    subtitle="vs last month"
  />
</template>

<script setup>
import { DollarSign } from 'lucide-vue-next'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}
</script>
```

## Dashboard Components

### QuickActions

Quick action buttons for dashboard.

**Usage:**
```vue
<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <QuickAction
      :icon="Sparkles"
      label="Generate Content"
      @click="navigateTo('/ai-content')"
    />
    <QuickAction
      :icon="Link"
      label="Create Link"
      @click="navigateTo('/affiliate')"
    />
  </div>
</template>
```

### Chart

Chart wrapper component using Chart.js.

**Props:**
- `type`: 'line' | 'bar' | 'pie' | 'doughnut'
- `data`: ChartData (required)
- `options`: ChartOptions

**Usage:**
```vue
<template>
  <Chart
    type="line"
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script setup>
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Revenue',
    data: [1000, 1500, 1200, 1800, 2000],
    borderColor: 'rgb(147, 51, 234)',
    backgroundColor: 'rgba(147, 51, 234, 0.1)'
  }]
}
</script>
```

## Content Components

### AIGenerator

AI content generation interface.

**Props:**
- `contentType`: string (required)
- `platform`: string (required)

**Events:**
- `generate`: Content generation requested
- `save`: Content save requested

### ContentEditor

Rich text editor for content editing.

**Props:**
- `modelValue`: string
- `placeholder`: string
- `maxLength`: number

**Events:**
- `update:modelValue`: Content changed

### ViralScoreCard

Display viral score with breakdown.

**Props:**
- `score`: number (0-100)
- `breakdown`: ScoreBreakdown

## Shared Components

### Navbar

Top navigation bar.

### Sidebar

Side navigation menu with collapsible sections.

### Footer

Footer component with links and social media.

### Logo

Application logo component with responsive sizing.

### UserMenu

User dropdown menu with profile and settings.

### NotificationBell

Notification bell with unread count badge.

## Design Tokens

### Colors

```css
/* Primary */
--color-primary-500: rgb(147, 51, 234)
--color-primary-600: rgb(126, 34, 206)

/* Secondary */
--color-secondary-500: rgb(59, 130, 246)
--color-secondary-600: rgb(37, 99, 235)

/* Success */
--color-success-500: rgb(34, 197, 94)
--color-success-600: rgb(22, 163, 74)

/* Danger */
--color-danger-500: rgb(239, 68, 68)
--color-danger-600: rgb(220, 38, 38)

/* Warning */
--color-warning-500: rgb(251, 191, 36)
--color-warning-600: rgb(245, 158, 11)
```

### Spacing

```css
--spacing-1: 0.25rem  /* 4px */
--spacing-2: 0.5rem   /* 8px */
--spacing-3: 0.75rem  /* 12px */
--spacing-4: 1rem     /* 16px */
--spacing-6: 1.5rem   /* 24px */
--spacing-8: 2rem     /* 32px */
```

### Border Radius

```css
--radius-lg: 0.75rem  /* 12px */
--radius-xl: 1rem     /* 16px */
--radius-2xl: 1.5rem  /* 24px */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

## Glassmorphism Effect

```css
.glass-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

## Gradient Classes

```css
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
```

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
2xl: 1536px /* @media (min-width: 1536px) */
```

## Best Practices

1. **Always use components over custom HTML**
   - Maintains consistency
   - Easier to update globally
   - Better accessibility

2. **Use proper variants**
   - Don't override component styles
   - Use variant props instead

3. **Provide feedback**
   - Always show loading states
   - Display error messages
   - Give success confirmations

4. **Be accessible**
   - Use proper labels
   - Include ARIA attributes
   - Test with keyboard navigation

5. **Keep it simple**
   - Don't over-engineer
   - Use built-in props
   - Compose components

## Examples

### Login Form

```vue
<template>
  <Card title="Login" class="max-w-md mx-auto">
    <form @submit.prevent="handleLogin">
      <div class="space-y-4">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          :leading-icon="Mail"
          :error="errors.email"
          required
        />

        <Input
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :leading-icon="Lock"
          :error="errors.password"
          required
        />

        <GradientButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          class="w-full"
        >
          Login
        </GradientButton>
      </div>
    </form>
  </Card>
</template>
```

### Content Generation Form

```vue
<template>
  <Card title="Generate Content" :icon="Sparkles">
    <div class="space-y-4">
      <Select
        v-model="platform"
        label="Platform"
        :options="platformOptions"
        :leading-icon="Video"
        required
      />

      <Select
        v-model="contentType"
        label="Content Type"
        :options="contentTypeOptions"
        required
      />

      <Textarea
        v-model="description"
        label="Description"
        placeholder="Describe your content..."
        :rows="4"
        :max-length="500"
        required
      />

      <div class="flex gap-2">
        <Badge label="TikTok" variant="primary" />
        <Badge label="Viral Hook" variant="success" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <GradientButton variant="ghost" @click="handleReset">
          Reset
        </GradientButton>
        <GradientButton
          variant="primary"
          :loading="generating"
          :icon="Sparkles"
          @click="handleGenerate"
        >
          Generate
        </GradientButton>
      </div>
    </template>
  </Card>
</template>
```

---

**For more examples, see the component files in `app/components/ui/`**
