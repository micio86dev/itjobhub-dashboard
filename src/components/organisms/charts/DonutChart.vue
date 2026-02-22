<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTheme } from '@/composables/useTheme'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

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

const { theme } = useTheme()

const PALETTE = ['#22c55e', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#3b82f6', '#f59e0b']

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item' },
  legend: {
    bottom: 0,
    textStyle: { color: theme.value === 'dark' ? '#a1a1aa' : '#71717a', fontSize: 11 },
  },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['50%', '42%'],
    label: {
      show: true,
      position: 'center',
      formatter: () => `${total.value.toLocaleString()}`,
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.value === 'dark' ? '#f4f4f5' : '#18181b',
    },
    emphasis: { label: { show: true } },
    data: props.data.map((d, i) => ({
      name: d.name,
      value: d.value,
      itemStyle: { color: PALETTE[i % PALETTE.length] },
    })),
  }],
}))
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <h3 class="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ title }}</h3>
    <template v-if="loading">
      <div class="h-56 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    </template>
    <VChart v-else class="h-56 w-full" :option="option" autoresize />
  </div>
</template>
