<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold text-3xl tracking-tight">{{ t('analyticsPage.title') }}</h2>
        <p class="text-muted-foreground">{{ t('analyticsPage.subtitle') }}</p>
      </div>
      <Button @click="refreshAll" :disabled="isRefreshing">
        <RefreshCw class="mr-2 w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
        {{ t('overview.refresh') }}
      </Button>
    </div>

    <!-- Charts Layout -->
    <div class="gap-6 grid md:grid-cols-2">
      <!-- Registrations (Line) -->
      <LineChart
        :title="t('analyticsPage.charts.registrations')"
        :series="[{ name: 'Registrations', data: registrationsData?.map(d => d.count) || [] }]"
        :x-labels="registrationsData?.map(d => d.date) || []"
        :loading="isRegistrationsLoading"
      />
      <!-- Jobs per Platform (Bar) -->
      <BarChart
        :title="t('analyticsPage.charts.jobs')"
        :data="jobsData?.map(d => ({ label: d.week, value: d.count })) || []"
        :loading="isJobsLoading"
      />
    </div>

    <div class="gap-6 grid md:grid-cols-3">
      <div class="md:col-span-1 shadow-sm border rounded-xl overflow-hidden">
        <DonutChart
          :title="t('overview.charts.loginMethods')"
          :data="loginMethodsData?.map(d => ({ name: d.method, value: d.count })) || []"
          :loading="isLoginMethodsLoading"
        />
      </div>
      <div class="md:col-span-2 shadow-sm border rounded-xl overflow-hidden">
        <HeatmapChart
          :title="t('analyticsPage.charts.heatmap')"
          :x-labels="['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']"
          :y-labels="['00-04', '04-08', '08-12', '12-16', '16-20', '20-24']"
          :data="heatmapData || generateMockHeatmap()"
          :loading="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { RefreshCw } from 'lucide-vue-next'

import { analyticsService } from '@/services/analytics.service'

import { Button } from '@/components/ui/button'
import LineChart from '@/components/organisms/charts/LineChart.vue'
import BarChart from '@/components/organisms/charts/BarChart.vue'
import DonutChart from '@/components/organisms/charts/DonutChart.vue'
import HeatmapChart from '@/components/organisms/charts/HeatmapChart.vue'

const { t } = useI18n()
const queryClient = useQueryClient()
const isRefreshing = ref(false)
const staleTime = 5 * 60 * 1000

const { data: registrationsData, isLoading: isRegistrationsLoading } = useQuery({
  queryKey: ['analytics_registrationsTimeline'],
  queryFn: () => analyticsService.getRegistrationsTimeline(180), // 6 months
  staleTime
})

const { data: jobsData, isLoading: isJobsLoading } = useQuery({
  queryKey: ['analytics_jobsTimeline'],
  queryFn: () => analyticsService.getJobsTimeline(12), 
  staleTime
})

const { data: loginMethodsData, isLoading: isLoginMethodsLoading } = useQuery({
  queryKey: ['analytics_loginMethods'],
  queryFn: () => analyticsService.getLoginMethodsDistribution(),
  staleTime
})

const refreshAll = async () => {
  isRefreshing.value = true
  await queryClient.invalidateQueries()
  isRefreshing.value = false
}

// Generate some mock data for the heatmap since the backend doesn't provide it yet
const generateMockHeatmap = () => {
  const data: [number, number, number][] = []
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 6; y++) {
      // Create some variance, peak at middle of day
      const val = Math.floor(Math.random() * 50) + (y > 1 && y < 5 ? 30 : 0)
      data.push([x, y, val])
    }
  }
  return data
}

const heatmapData = ref(null) // Mocked natively in template until service implements it
</script>
