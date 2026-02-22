<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart as EBarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTheme } from '@/composables/useTheme'

use([CanvasRenderer, EBarChart, GridComponent, TooltipComponent])

interface BarItem {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    title: string
    data: BarItem[]
    horizontal?: boolean
    loading?: boolean
  }>(),
  { horizontal: false, loading: false },
)

const { theme } = useTheme()

const option = computed(() => {
  const labels = props.data.map((d) => d.label)
  const values = props.data.map((d) => d.value)
  const textColor = theme.value === 'dark' ? '#a1a1aa' : '#71717a'
  const gridColor = theme.value === 'dark' ? '#27272a' : '#f4f4f5'
  const axisColor = theme.value === 'dark' ? '#3f3f46' : '#e4e4e7'

  if (props.horizontal) {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 120, right: 16, top: 8, bottom: 8 },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: textColor, fontSize: 11 },
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: axisColor } },
        axisTick: { show: false },
        axisLabel: { color: textColor, fontSize: 11, width: 110, overflow: 'truncate' },
      },
      series: [
        {
          type: 'bar',
          data: Array.isArray(values) ? values : [],
          barMaxWidth: 16,
          itemStyle: { color: '#22c55e', borderRadius: [0, 4, 4, 0] },
          emphasis: { itemStyle: { color: '#16a34a' } },
        },
      ],
    }
  }

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 40, right: 16, top: 8, bottom: 24 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { show: false },
      axisLabel: { color: textColor, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor, fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: Array.isArray(values) ? values : [],
        barMaxWidth: 32,
        itemStyle: { color: '#22c55e', borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: '#16a34a' } },
      },
    ],
  }
})
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
