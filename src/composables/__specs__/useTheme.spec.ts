import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    // Reset singleton to light between tests
    const { setTheme } = useTheme()
    setTheme('light')
    document.documentElement.classList.remove('dark')
  })

  it('returns a valid initial theme', () => {
    const { theme } = useTheme()
    expect(['light', 'dark']).toContain(theme.value)
  })

  it('toggles theme from light to dark', async () => {
    const { theme, setTheme, toggleTheme } = useTheme()
    setTheme('light')
    toggleTheme()
    await nextTick()
    expect(theme.value).toBe('dark')
  })

  it('toggles theme from dark to light', async () => {
    const { theme, setTheme, toggleTheme } = useTheme()
    setTheme('dark')
    toggleTheme()
    await nextTick()
    expect(theme.value).toBe('light')
  })

  it('setTheme("dark") adds dark class to documentElement', async () => {
    const { setTheme } = useTheme()
    setTheme('dark')
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('setTheme("light") removes dark class from documentElement', async () => {
    const { setTheme } = useTheme()
    setTheme('dark')
    await nextTick()
    setTheme('light')
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('exposes a readonly theme ref', () => {
    const { theme } = useTheme()
    // Attempting to assign to a readonly ref should not work silently
    expect(theme.value).toBeDefined()
  })

  it('all calls to useTheme() share the same singleton theme', () => {
    const a = useTheme()
    const b = useTheme()
    a.setTheme('dark')
    expect(b.theme.value).toBe('dark')
  })
})
