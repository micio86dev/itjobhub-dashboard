<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart as EBarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { getChartColors } from '@/utils/chartColors'

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

const option = computed(() => {
  const labels = props.data.map((d) => d.label)
  const values = props.data.map((d) => d.value)
  const colors = getChartColors()

  if (props.horizontal) {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 120, right: 16, top: 8, bottom: 8 },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: colors.grid } },
        axisLabel: { color: colors.text, fontSize: 11 },
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: colors.axis } },
        axisTick: { show: false },
        axisLabel: { color: colors.text, fontSize: 11, width: 110, overflow: 'truncate' },
      },
      series: [
        {
          type: 'bar',
          data: Array.isArray(values) ? values : [],
          barMaxWidth: 16,
          itemStyle: { color: colors.primary, borderRadius: [0, 4, 4, 0] },
          emphasis: { itemStyle: { color: colors.primaryAlt } },
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
      axisLine: { lineStyle: { color: colors.axis } },
      axisTick: { show: false },
      axisLabel: { color: colors.text, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: colors.grid } },
      axisLabel: { color: colors.text, fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: Array.isArray(values) ? values : [],
        barMaxWidth: 32,
        itemStyle: { color: colors.primary, borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: colors.primaryAlt } },
      },
    ],
  }
})
</script>

<template>
  <div class="chart-card">
    <h3 class="section-heading">{{ title }}</h3>
    <template v-if="loading">
      <div class="h-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    </template>
    <div v-else class="h-48">
      <VChart class="h-full w-full" :option="option" autoresize />
    </div>
  </div>
</template>
