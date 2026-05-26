import { ref, computed } from 'vue'
import en from '~/locales/en'
import th from '~/locales/th'
import es from '~/locales/es'
import fr from '~/locales/fr'

export type SupportedLocale = 'en' | 'th' | 'es' | 'fr'

const translations = {
  en,
  th,
  es,
  fr,
}

// Global locale state (shared across all instances)
const globalLocale = ref<SupportedLocale>('en')

export const useLocale = () => {
  const isClient = typeof window !== 'undefined'

  // Load locale from localStorage
  const loadLocale = () => {
    if (!isClient) return

    const savedLocale = localStorage.getItem('locale') as SupportedLocale | null
    if (savedLocale && translations[savedLocale]) {
      globalLocale.value = savedLocale
    }
  }

  // Set locale and save to localStorage
  const setLocale = (newLocale: SupportedLocale) => {
    globalLocale.value = newLocale

    if (isClient) {
      localStorage.setItem('locale', newLocale)
      // Update HTML lang attribute
      document.documentElement.lang = newLocale
    }
  }

  // Get current translations
  const t = computed(() => translations[globalLocale.value])

  return {
    locale: globalLocale,
    loadLocale,
    setLocale,
    t,
  }
}
