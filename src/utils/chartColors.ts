/**
 * Utility functions for reading chart colors from CSS custom properties
 */

/**
 * Get a CSS custom property value from the document root
 */
export function getCSSVar(varName: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

/**
 * Get chart color palette from CSS variables
 */
export function getChartColors() {
  return {
    primary: getCSSVar('--c-chart-primary'),
    primaryAlt: getCSSVar('--c-chart-primary-alt'),
    secondary: getCSSVar('--c-chart-secondary'),
    accent: getCSSVar('--c-chart-accent'),
    text: getCSSVar('--c-chart-text'),
    textMuted: getCSSVar('--c-chart-text-muted'),
    textStrong: getCSSVar('--c-chart-text-strong'),
    grid: getCSSVar('--c-chart-grid'),
    axis: getCSSVar('--c-chart-axis'),
    bg: getCSSVar('--c-chart-bg'),
  }
}

/**
 * Get a palette of colors for multi-series charts
 */
export function getChartPalette(): string[] {
  const colors = getChartColors()
  return [
    colors.primary,
    colors.text,
    colors.textMuted,
    getCSSVar('--color-zinc-300'),
    getCSSVar('--color-zinc-200'),
    colors.secondary,
    colors.accent,
  ]
}
