<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart as ELineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { getChartColors } from '@/utils/chartColors'

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

const option = computed(() => {
  const colors = getChartColors()

  return {
    backgroundColor: 'transparent',
    textStyle: { color: colors.text },
    tooltip: { trigger: 'axis' },
    legend:
      props.series.length > 1
        ? { bottom: 0, textStyle: { color: colors.text } }
        : undefined,
    grid: { left: 40, right: 16, top: 16, bottom: props.series.length > 1 ? 40 : 16 },
    xAxis: {
      type: 'category',
      data: props.xLabels,
      axisLine: { lineStyle: { color: colors.axis } },
      axisTick: { show: false },
      axisLabel: { color: colors.textMuted, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: colors.grid } },
      axisLabel: { color: colors.textMuted, fontSize: 11 },
    },
    series: props.series.map((s, i) => ({
      name: s.name,
      type: 'line',
      data: Array.isArray(s.data) ? s.data : [],
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { color: i === 0 ? colors.primary : colors.secondary, width: 2 },
      itemStyle: { color: i === 0 ? colors.primary : colors.secondary },
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
                { offset: 0, color: colors.primary.replace('rgb', 'rgba').replace(')', ',0.2)') },
                { offset: 1, color: colors.primary.replace('rgb', 'rgba').replace(')', ',0)') },
              ],
            },
          }
          : undefined,
    })),
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
