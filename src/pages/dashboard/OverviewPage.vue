<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { RefreshCw, Users, Briefcase, Building2, Newspaper } from 'lucide-vue-next'
import { format, type Locale } from 'date-fns'
import { it, enUS, fr, es, de } from 'date-fns/locale'
import StatCard from '@/components/organisms/StatCard.vue'
import TopList from '@/components/organisms/TopList.vue'
import LineChart from '@/components/organisms/charts/LineChart.vue'
import BarChart from '@/components/organisms/charts/BarChart.vue'
import DonutChart from '@/components/organisms/charts/DonutChart.vue'
import DataTable from '@/components/organisms/DataTable.vue'
import { analyticsService } from '@/services/analytics.service'
import { jobsService } from '@/services/jobs.service'
import { usersService } from '@/services/users.service'
import type { ColumnDef } from '@tanstack/vue-table'
import type { JobListItem, UserListItem } from '@/api'

const { t, locale } = useI18n()
const qc = useQueryClient()

const dateLocales: Record<string, Locale> = { it, en: enUS, fr, es, de }

const now = computed(() =>
  format(new Date(), 'PPpp', { locale: dateLocales[locale.value] ?? enUS }),
)

const statsQ = useQuery({ queryKey: ['overview-stats'], queryFn: analyticsService.getOverviewStats })
const regTimelineQ = useQuery({ queryKey: ['reg-timeline'], queryFn: () => analyticsService.getRegistrationsTimeline(30) })
const jobsTimelineQ = useQuery({ queryKey: ['jobs-timeline'], queryFn: () => analyticsService.getJobsTimeline(8) })
const loginMethodsQ = useQuery({ queryKey: ['login-methods'], queryFn: analyticsService.getLoginMethodsDistribution })
const topSkillsQ = useQuery({ queryKey: ['top-skills'], queryFn: () => analyticsService.getTopSkills(10) })
const topLangsQ = useQuery({ queryKey: ['top-langs'], queryFn: () => analyticsService.getTopLanguages(10) })
const latestJobsQ = useQuery({ queryKey: ['latest-jobs'], queryFn: () => jobsService.getJobs({ limit: 10, sortBy: 'created_at', sortOrder: 'desc' }) })
const latestUsersQ = useQuery({ queryKey: ['latest-users'], queryFn: () => usersService.getUsers({ limit: 10 }) })

const regChartSeries = computed(() => [{
  name: t('overview.totalUsers'),
  data: regTimelineQ.data.value?.map((p) => p.count) ?? [],
}])
const regChartLabels = computed(() => regTimelineQ.data.value?.map((p) => p.date.slice(5)) ?? [])

const jobsChartData = computed(() =>
  (jobsTimelineQ.data.value ?? []).map((p) => ({ label: p.date, value: p.count })),
)

const loginMethodsData = computed(() =>
  (loginMethodsQ.data.value ?? []).map((m) => ({ name: m.method, value: m.count })),
)

const topSkillsItems = computed(() =>
  (topSkillsQ.data.value ?? []).map((s) => ({ label: s.skill, count: s.count })),
)

const topLangsItems = computed(() =>
  (topLangsQ.data.value ?? []).map((s) => ({ label: s.skill, count: s.count })),
)

const jobColumns: ColumnDef<JobListItem>[] = [
  { id: 'title', accessorKey: 'title', header: t('jobs.jobTitle') },
  { id: 'company', accessorFn: (r) => r.company?.name ?? '-', header: t('jobs.company') },
  { id: 'workMode', accessorKey: 'workMode', header: t('jobs.type') },
  { id: 'created_at', accessorFn: (r) => r.created_at?.slice(0, 10) ?? '-', header: t('jobs.publishedAt') },
  { id: 'status', accessorKey: 'status', header: t('jobs.status') },
]

const userColumns: ColumnDef<UserListItem>[] = [
  { id: 'name', accessorFn: (r) => `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || '-', header: t('users.name') },
  { id: 'email', accessorKey: 'email', header: t('users.email') },
  { id: 'role', accessorKey: 'role', header: t('users.role') },
]

function refreshAll() { qc.invalidateQueries() }
</script>

<template>
  <div class="page-stack">

    <!-- Header -->
    <div class="page-header-row">
      <div>
        <h1 class="page-title">{{ $t('overview.title') }}</h1>
        <p class="page-subtitle">{{ $t('overview.subtitle') }} {{ now }}</p>
      </div>
      <button class="btn-outline" @click="refreshAll">
        <RefreshCw class="h-4 w-4" />
        {{ $t('common.refresh') }}
      </button>
    </div>

    <!-- ROW 1 — Stat cards -->
    <div class="stats-grid">
      <StatCard :title="$t('overview.totalUsers')" :value="statsQ.data.value?.users ?? 0"
        :change="statsQ.data.value?.usersChange" :icon="Users" :loading="statsQ.isPending.value" />
      <StatCard :title="$t('overview.activeJobs')" :value="statsQ.data.value?.jobs ?? 0"
        :change="statsQ.data.value?.jobsChange" :icon="Briefcase" :loading="statsQ.isPending.value" />
      <StatCard :title="$t('overview.companies')" :value="statsQ.data.value?.companies ?? 0" :icon="Building2"
        :loading="statsQ.isPending.value" />
      <StatCard :title="$t('overview.news')" :value="statsQ.data.value?.news ?? 0" :icon="Newspaper"
        :loading="statsQ.isPending.value" />
    </div>

    <!-- ROW 2 — Charts 2-col -->
    <div class="grid-2col">
      <LineChart :title="$t('overview.registrationsChart')" :series="regChartSeries" :x-labels="regChartLabels"
        :loading="regTimelineQ.isPending.value" />
      <BarChart :title="$t('overview.jobsWeeklyChart')" :data="jobsChartData"
        :loading="jobsTimelineQ.isPending.value" />
    </div>

    <!-- ROW 3 — Donut + top lists 3-col -->
    <div class="grid-3col">
      <DonutChart :title="$t('overview.loginMethods')" :data="loginMethodsData"
        :loading="loginMethodsQ.isPending.value" />
      <TopList :title="$t('overview.topSkills')" :items="topSkillsItems" :loading="topSkillsQ.isPending.value" />
      <TopList :title="$t('overview.topLanguages')" :items="topLangsItems" :loading="topLangsQ.isPending.value" />
    </div>

    <!-- ROW 4 — Mini tables 2-col -->
    <div class="grid-2col">
      <div>
        <h2 class="section-heading">{{ $t('overview.latestJobs') }}</h2>
        <DataTable :columns="jobColumns" :data="latestJobsQ.data.value?.items ?? []"
          :loading="latestJobsQ.isPending.value" :searchable="false" :page-size="10" />
      </div>
      <div>
        <h2 class="section-heading">{{ $t('overview.latestUsers') }}</h2>
        <DataTable :columns="userColumns" :data="latestUsersQ.data.value?.items ?? []"
          :loading="latestUsersQ.isPending.value" :searchable="false" :page-size="10" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-subtitle {
  margin-top: 0.125rem;
  font-size: var(--text-sm);
  color: var(--c-text-muted);
}
</style>
