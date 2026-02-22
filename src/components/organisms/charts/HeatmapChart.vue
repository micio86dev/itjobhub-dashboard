<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { HeatmapChart as EHeatmapChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTheme } from '@/composables/useTheme'

use([CanvasRenderer, EHeatmapChart, GridComponent, TooltipComponent, VisualMapComponent])

const props = withDefaults(
  defineProps<{
    title: string
    data: [number, number, number][]
    xLabels: string[]
    yLabels: string[]
    loading?: boolean
  }>(),
  { loading: false },
)

const { theme } = useTheme()

const maxVal = computed(() => Math.max(...props.data.map((d) => d[2]), 1))

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { position: 'top', formatter: (p: { value: [number, number, number] }) => `${props.yLabels[p.value[1]]} ${props.xLabels[p.value[0]]}: ${p.value[2]}` },
  grid: { left: 60, right: 60, top: 8, bottom: 24 },
  xAxis: { type: 'category', data: props.xLabels, splitArea: { show: true }, axisLabel: { color: theme.value === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 10 } },
  yAxis: { type: 'category', data: props.yLabels, splitArea: { show: true }, axisLabel: { color: theme.value === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 11 } },
  visualMap: {
    min: 0, max: maxVal.value, calculable: true, orient: 'horizontal', left: 'right', bottom: 0,
    inRange: { color: [theme.value === 'dark' ? '#1c1c1e' : '#f0fdf4', '#22c55e', '#14532d'] },
    textStyle: { color: theme.value === 'dark' ? '#71717a' : '#a1a1aa' },
  },
  series: [{
    type: 'heatmap',
    data: props.data,
    label: { show: false },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
  }],
}))
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <h3 class="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ title }}</h3>
    <template v-if="loading">
      <div class="h-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    </template>
    <VChart v-else class="h-48 w-full" :option="option" autoresize />
  </div>
</template>
