import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import it from '@/i18n/locales/it'

// matchMedia polyfill — happy-dom does not implement matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

// ResizeObserver polyfill
class ResizeObserverStub {
  observe() { return undefined }
  unobserve() { return undefined }
  disconnect() { return undefined }
}
;(globalThis as unknown as Record<string, unknown>).ResizeObserver = ResizeObserverStub

// Install i18n globally so all mounted components can use $t / useI18n()
const i18n = createI18n({
  legacy: false,
  locale: 'it',
  messages: { it },
})

config.global.plugins = [i18n]
