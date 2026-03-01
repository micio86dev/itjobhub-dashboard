import { createI18n } from 'vue-i18n'
import it from './locales/it'
import en from './locales/en'
import fr from './locales/fr'
import es from './locales/es'
import de from './locales/de'

export type Locale = 'it' | 'en' | 'fr' | 'es' | 'de'

const savedLocale = localStorage.getItem('admin-locale') as Locale | null

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale ?? 'it',
  fallbackLocale: 'en',
  messages: { it, en, fr, es, de },
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('admin-locale', locale)
  document.documentElement.setAttribute('lang', locale)
}
