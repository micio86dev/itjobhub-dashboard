<template>
  <Card class="flex flex-col h-full" data-testid="bar-chart">
    <CardHeader class="pb-2">
      <CardTitle class="font-semibold text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="relative flex-1 min-h-[300px]">
      <div v-if="loading" class="absolute inset-x-6 inset-y-0 flex items-end gap-2 pt-2 pb-6" :class="{ 'flex-col items-start gap-4': horizontal }">
        <Skeleton v-for="i in 10" :key="i" class="rounded-sm w-full h-full" :style="horizontal ? { width: `${Math.max(20, Math.random() * 100)}%`, height: '100%' } : { height: `${Math.max(20, Math.random() * 100)}%` }" />
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
  data: Array<{ label: string; value: number }>
  horizontal?: boolean
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
  const xAxis = props.horizontal ? { type: 'value', splitLine: { show: false } } : { type: 'category', data: props.data.map(d => d.label) }
  const yAxis = props.horizontal ? { type: 'category', data: props.data.map(d => d.label) } : { type: 'value', splitLine: { lineStyle: { color: isDark.value ? '#3f3f46' : '#f4f4f5' } } }
  
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis,
    yAxis,
    series: [
      {
        type: 'bar',
        data: props.data.map(d => d.value),
        itemStyle: {
          color: '#22c55e',
          borderRadius: props.horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#16a34a'
          }
        }
      }
    ]
  }
})
</script>
