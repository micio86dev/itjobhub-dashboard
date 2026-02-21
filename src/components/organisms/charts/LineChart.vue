<template>
  <Card class="flex flex-col h-full" data-testid="line-chart">
    <CardHeader class="pb-2">
      <CardTitle class="font-semibold text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="relative flex-1 min-h-[300px]">
      <div v-if="loading" class="absolute inset-x-6 inset-y-0 flex items-end gap-2 pt-2 pb-6">
        <Skeleton v-for="i in 10" :key="i" class="rounded-sm w-full h-full" :style="{ height: `${Math.max(20, Math.random() * 100)}%` }" />
      </div>
      <v-chart 
        v-else 
        class="absolute inset-0 p-6 pt-0 w-full h-full" 
        :option="chartOption" 
        :theme="isDark ? 'dark' : 'light'" 
        autoresize 
      />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import VChart from 'vue-echarts'
import '@/plugins/echarts'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{
  title: string
  series: Array<{ name: string; data: number[] }>
  xLabels: string[]
  loading?: boolean
}>()

const { theme } = useTheme()
const isDark = computed(() => {
  if (theme.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme.value === 'dark'
})

const chartOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: props.series.length > 1,
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: props.series.length > 1 ? '15%' : '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xLabels,
      axisLine: { lineStyle: { color: isDark.value ? '#52525b' : '#e4e4e7' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: isDark.value ? '#3f3f46' : '#f4f4f5' } }
    },
    series: props.series.map(s => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: true,
      showSymbol: false,
      itemStyle: { color: '#22c55e' }, // brand-neon
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(34, 197, 94, 0.4)'
          }, {
            offset: 1, color: 'rgba(34, 197, 94, 0.05)'
          }]
        }
      }
    }))
  }
})
</script>
