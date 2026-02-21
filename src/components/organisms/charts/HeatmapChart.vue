<template>
  <Card class="flex flex-col h-full" data-testid="heatmap-chart">
    <CardHeader class="pb-2">
      <CardTitle class="font-semibold text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="relative flex-1 min-h-[300px]">
      <div v-if="loading" class="absolute inset-x-6 inset-y-0 pt-2 pb-6">
        <Skeleton class="rounded-sm w-full h-full" />
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
  data: Array<[number, number, number]> // [x, y, value]
  xLabels: string[]
  yLabels: string[]
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
  const maxVal = props.data.length > 0 ? Math.max(...props.data.map(item => item[2])) : 100

  return {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      formatter: function (params: { data: [number, number, number] }) {
        return `Ore: ${props.xLabels[params.data[0]]}<br>Giorno: ${props.yLabels[params.data[1]]}<br>Valore: ${params.data[2]}`
      }
    },
    grid: {
      height: '60%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: props.xLabels,
      splitArea: { show: true }
    },
    yAxis: {
      type: 'category',
      data: props.yLabels,
      splitArea: { show: true }
    },
    visualMap: {
      min: 0,
      max: maxVal,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: isDark.value ? ['#18181b', '#166534', '#22c55e'] : ['#f4f4f5', '#bbf7d0', '#16a34a']
      }
    },
    series: [{
      name: props.title,
      type: 'heatmap',
      data: props.data,
      label: {
        show: false
      },
      itemStyle: {
        borderColor: isDark.value ? '#27272a' : '#ffffff',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
})
</script>
