<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart as ELineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTheme } from '@/composables/useTheme'

use([CanvasRenderer, ELineChart, GridComponent, TooltipComponent, LegendComponent])

interface Series {
  name: string
  data: number[]
}

const props = withDefaults(
  defineProps<{
    title: string
    series: Series[]
    xLabels: string[]
    loading?: boolean
  }>(),
  { loading: false },
)

const { theme } = useTheme()

const option = computed(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: theme.value === 'dark' ? '#a1a1aa' : '#71717a' },
  tooltip: { trigger: 'axis' },
  legend:
    props.series.length > 1
      ? { bottom: 0, textStyle: { color: theme.value === 'dark' ? '#a1a1aa' : '#71717a' } }
      : undefined,
  grid: { left: 40, right: 16, top: 16, bottom: props.series.length > 1 ? 40 : 16 },
  xAxis: {
    type: 'category',
    data: props.xLabels,
    axisLine: { lineStyle: { color: theme.value === 'dark' ? '#3f3f46' : '#e4e4e7' } },
    axisTick: { show: false },
    axisLabel: { color: theme.value === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: theme.value === 'dark' ? '#27272a' : '#f4f4f5' } },
    axisLabel: { color: theme.value === 'dark' ? '#71717a' : '#a1a1aa', fontSize: 11 },
  },
  series: props.series.map((s, i) => ({
    name: s.name,
    type: 'line',
    data: Array.isArray(s.data) ? s.data : [],
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,
    lineStyle: { color: i === 0 ? '#22c55e' : '#3b82f6', width: 2 },
    itemStyle: { color: i === 0 ? '#22c55e' : '#3b82f6' },
    areaStyle:
      i === 0
        ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(34,197,94,0.2)' },
                { offset: 1, color: 'rgba(34,197,94,0)' },
              ],
            },
          }
        : undefined,
  })),
}))
</script>

<template>
  <div
    class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
  >
    <h3 class="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ title }}</h3>
    <template v-if="loading">
      <div class="h-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    </template>
    <div v-else class="h-48">
      <VChart class="h-full w-full" :option="option" autoresize />
    </div>
  </div>
</template>
