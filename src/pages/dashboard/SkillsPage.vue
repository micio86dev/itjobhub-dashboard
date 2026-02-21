<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold text-3xl tracking-tight">{{ t('skillsPage.title') }}</h2>
        <p class="text-muted-foreground">{{ t('skillsPage.subtitle') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex sm:flex-row flex-col gap-4 mb-6">
      <Select v-model="filters.category" @update:model-value="() => refetch()">
        <SelectTrigger class="w-[200px]">
          <SelectValue :placeholder="t('skillsPage.categories.all')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{{ t('skillsPage.categories.all') }}</SelectItem>
          <SelectItem value="frontend">{{ t('skillsPage.categories.frontend') }}</SelectItem>
          <SelectItem value="backend">{{ t('skillsPage.categories.backend') }}</SelectItem>
          <SelectItem value="devops">{{ t('skillsPage.categories.devops') }}</SelectItem>
          <SelectItem value="data">{{ t('skillsPage.categories.data') }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Layout -->
    <div class="gap-6 grid lg:grid-cols-2">
      <!-- Top Skills -->
      <TopList
        :title="t('skillsPage.charts.topSkills')"
        :items="topSkillsData?.map(d => ({ label: d.skill, count: d.count })) || []"
        :loading="isLoading"
      />
      <!-- Trend / Growth -->
      <BarChart
        :title="t('skillsPage.charts.growth')"
        :data="generateMockGrowthTrend()"
        :horizontal="true"
        :loading="isLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'

import { analyticsService } from '@/services/analytics.service'

import TopList from '@/components/organisms/TopList.vue'
import BarChart from '@/components/organisms/charts/BarChart.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { t } = useI18n()

const filters = ref({
  category: 'all'
})

const { data: topSkillsData, isLoading, refetch } = useQuery({
  queryKey: ['skills_top', filters],
  queryFn: () => analyticsService.getTopSkills(20), // Can be mocked to change based on category
  staleTime: 5 * 60 * 1000
})

// Mock growth trend
const generateMockGrowthTrend = () => {
  return [
    { label: 'React', value: 25 },
    { label: 'Vue.js', value: 18 },
    { label: 'Python', value: 34 },
    { label: 'Go', value: 45 },
    { label: 'Rust', value: 60 }
  ]
}
</script>
