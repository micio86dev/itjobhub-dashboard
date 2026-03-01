/**
 * Utility functions for reading chart colors from CSS custom properties
 */

/**
 * Convert any CSS color (including OKLCH) to hex format for Canvas compatibility.
 * Canvas gradient API does NOT support oklch().
 * We draw a 1x1 pixel on a canvas to force the browser to resolve the color.
 */
function colorToHex(color: string): string {
  if (typeof window === 'undefined' || !color) return ''

  try {
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) return color

    // fillStyle ignores values it cannot parse and keeps the old one,
    // so we set a known baseline first.
    ctx.fillStyle = '#000'
    ctx.fillStyle = color

    // ctx.fillStyle always returns a valid #rrggbb or rgba() string
    return ctx.fillStyle
  } catch {
    return color
  }
}

/**
 * Get a CSS custom property value from the document root and convert to hex
 */
export function getCSSVar(varName: string): string {
  if (typeof window === 'undefined') return ''
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  return value ? colorToHex(value) : ''
}

/**
 * Add alpha transparency to any color string (hex, rgb, etc.)
 * Returns rgba() format that Canvas and ECharts can consume.
 */
export function addAlpha(color: string, alpha: number): string {
  // Handle hex (#rgb or #rrggbb)
  const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Handle rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = color.match(/rgba?\(([^)]+)\)/)
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map(s => s.trim())
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`
  }

  // Fallback: return color as-is
  return color
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
