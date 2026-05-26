import { ref, watch } from 'vue'

export const useTheme = () => {
  const theme = ref<'dark' | 'light'>('dark')
  const isClient = typeof window !== 'undefined'

  // Load theme from localStorage
  const loadTheme = () => {
    if (!isClient) return

    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      // Default to dark mode
      theme.value = 'dark'
    }

    applyTheme(theme.value)
  }

  // Apply theme to document
  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (!isClient) return

    const html = document.documentElement

    if (newTheme === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }

  // Set theme and save to localStorage
  const setTheme = (newTheme: 'dark' | 'light') => {
    theme.value = newTheme
    applyTheme(newTheme)

    if (isClient) {
      localStorage.setItem('theme', newTheme)
    }
  }

  // Toggle between dark and light
  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Watch theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    loadTheme,
    setTheme,
    toggleTheme,
  }
}
