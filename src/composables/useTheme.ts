import { shallowRef, watch, readonly } from 'vue'
import Cookies from 'js-cookie'

type Theme = 'light' | 'dark'
const COOKIE_KEY = 'admin-theme'

// Singleton state — shared across all component instances
const _theme = shallowRef<Theme>(resolveInitialTheme())

function resolveInitialTheme(): Theme {
  const saved = Cookies.get(COOKIE_KEY) as Theme | undefined
  if (saved === 'light' || saved === 'dark') return saved
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Apply immediately on module load
applyTheme(_theme.value)

// Watch singleton for changes
watch(_theme, (next) => {
  applyTheme(next)
  Cookies.set(COOKIE_KEY, next, { expires: 365 })
})

export function useTheme() {
  function toggleTheme() {
    _theme.value = _theme.value === 'light' ? 'dark' : 'light'
  }

  function setTheme(t: Theme) {
    _theme.value = t
  }

  return {
    theme: readonly(_theme),
    toggleTheme,
    setTheme,
  }
}
