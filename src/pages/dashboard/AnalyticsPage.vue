<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Info } from 'lucide-vue-next'
import LineChart from '@/components/organisms/charts/LineChart.vue'
import BarChart from '@/components/organisms/charts/BarChart.vue'
import { analyticsService } from '@/services/analytics.service'

const { t } = useI18n()

type Period = 7 | 30 | 90 | 365
const period = shallowRef<Period>(30)
const periods: { value: Period; label: string }[] = [
  { value: 7, label: t('analytics.days7') },
  { value: 30, label: t('analytics.days30') },
  { value: 90, label: t('analytics.days90') },
  { value: 365, label: t('analytics.months12') },
]

const regQ = useQuery({
  queryKey: ['reg-timeline-analytics', period],
  queryFn: () => analyticsService.getRegistrationsTimeline(period.value),
})

const jobsQ = useQuery({
  queryKey: ['jobs-timeline-analytics', period],
  queryFn: () => analyticsService.getJobsTimeline(Math.ceil(period.value / 7)),
})

const loginMethodsQ = useQuery({
  queryKey: ['login-methods-analytics'],
  queryFn: analyticsService.getLoginMethodsDistribution,
})

const topSkillsQ = useQuery({
  queryKey: ['top-skills-analytics'],
  queryFn: () => analyticsService.getTopSkills(20),
})

const regSeries = computed(() => [{
  name: t('analytics.registrations'),
  data: regQ.data.value?.map((p) => p.count) ?? [],
}])
const regLabels = computed(() => regQ.data.value?.map((p) => p.date.slice(5)) ?? [])

const jobsChartData = computed(() =>
  (jobsQ.data.value ?? []).map((p) => ({ label: p.date, value: p.count })),
)

const loginChartData = computed(() =>
  (loginMethodsQ.data.value ?? []).map((m) => ({ label: m.method, value: m.count })),
)

const skillsChartData = computed(() =>
  (topSkillsQ.data.value ?? []).map((s) => ({ label: s.skill, value: s.count })),
)
</script>

<template>
  <div class="page-stack">

    <!-- Header + period selector -->
    <div class="analytics-header">
      <h1 class="page-title">{{ $t('analytics.title') }}</h1>
      <div class="period-selector">
        <button v-for="p in periods" :key="p.value" class="btn-period" :class="{ 'is-active': period === p.value }"
          @click="period = p.value">
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Registrations & Auth -->
    <section>
      <h2 class="section-title">{{ $t('analytics.registrations') }}</h2>
      <div class="grid-2col">
        <LineChart :title="$t('analytics.dailySessions')" :series="regSeries" :x-labels="regLabels"
          :loading="regQ.isPending.value" />
        <BarChart :title="$t('analytics.registrationsByMethod')" :data="loginChartData"
          :loading="loginMethodsQ.isPending.value" />
      </div>
    </section>

    <!-- Jobs performance -->
    <section>
      <h2 class="section-title">{{ $t('analytics.jobsPerformance') }}</h2>
      <div class="grid-2col">
        <BarChart :title="$t('analytics.jobsBySector')" :data="jobsChartData" :loading="jobsQ.isPending.value" />
        <div class="card-placeholder">
          <div class="placeholder-inner">
            <Info class="placeholder-icon h-6 w-6" />
            <p class="placeholder-label">{{ $t('analytics.dailyApplications') }}</p>
            <p class="placeholder-hint">{{ $t('analytics.toImplement') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Searches -->
    <section>
      <h2 class="section-title">{{ $t('analytics.searches') }}</h2>
      <div class="grid-2col">
        <BarChart :title="$t('analytics.topKeywords')" :data="skillsChartData" :horizontal="true"
          :loading="topSkillsQ.isPending.value" />
        <div class="card-placeholder">
          <div class="placeholder-inner">
            <Info class="placeholder-icon h-6 w-6" />
            <p class="placeholder-label">{{ $t('analytics.activityHeatmap') }}</p>
            <p class="placeholder-hint">{{ $t('analytics.toImplement') }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.analytics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
}

.placeholder-inner {
  text-align: center;
}

.placeholder-icon {
  display: block;
  margin: 0 auto var(--sp-2);
  color: var(--c-text-subtle);
}
</style>
