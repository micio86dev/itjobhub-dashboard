<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GraphicComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { getChartColors, getChartPalette } from '@/utils/chartColors'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent, GraphicComponent])

interface DonutItem {
  name: string
  value: number
}

const props = withDefaults(
  defineProps<{
    title: string
    data: DonutItem[]
    loading?: boolean
  }>(),
  { loading: false },
)

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const option = computed(() => {
  const colors = getChartColors()
  const palette = getChartPalette()

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: colors.text, fontSize: 11 },
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '42%'],
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 5,
        label: { show: false },
      },
      data: props.data.map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: palette[i % palette.length] },
      })),
    }],
    graphic: [{
      type: 'text',
      left: 'center',
      top: '38%',
      style: {
        text: total.value.toLocaleString(),
        fontSize: 20,
        fontWeight: 'bold',
        fill: colors.textStrong,
        textAlign: 'center',
      },
    }],
  }
})
</script>

<template>
  <div class="chart-card">
    <h3 class="section-heading">{{ title }}</h3>
    <template v-if="loading">
      <div class="h-56 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    </template>
    <VChart v-else class="h-56 w-full" :option="option" autoresize />
  </div>
</template>
