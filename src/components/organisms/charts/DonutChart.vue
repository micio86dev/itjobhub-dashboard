<template>
  <Card class="flex flex-col h-full" data-testid="donut-chart">
    <CardHeader class="pb-2">
      <CardTitle class="font-semibold text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="relative flex-1 min-h-[300px]">
      <div v-if="loading" class="absolute inset-0 flex justify-center items-center pt-2 pb-6">
        <Skeleton class="rounded-full w-40 h-40" />
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
  data: Array<{ name: string; value: number }>
  loading?: boolean
}>()

const { theme } = useTheme()
const isDark = computed(() => {
  if (theme.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme.value === 'dark'
})

const totalValue = computed(() => props.data.reduce((acc, curr) => acc + curr.value, 0))

const chartOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0%',
      left: 'center'
    },
    color: ['#22c55e', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'], // green + zinc variants
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: isDark.value ? '#18181b' : '#ffffff', // zinc-900 or white
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            formatter: '{b}\n{c}'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data
      }
    ],
    // Trick to show total in the center by default
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: '42%',
          style: {
            text: totalValue.value.toString(),
            fontSize: 24,
            fontWeight: 'bold',
            fill: isDark.value ? '#ffffff' : '#000000'
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '52%',
          style: {
            text: 'Totale',
            fontSize: 12,
            fill: '#71717a'
          }
        }
      ]
    }
  }
})
</script>
