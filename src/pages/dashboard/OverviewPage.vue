<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold text-3xl tracking-tight">{{ t('overview.title') }}</h2>
        <p class="text-muted-foreground">{{ t('overview.updatedAt') }}: {{ new Date().toLocaleString() }}</p>
      </div>
      <Button @click="refreshAll" :disabled="isRefreshing">
        <RefreshCw class="mr-2 w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
        {{ t('overview.refresh') }}
      </Button>
    </div>

    <!-- ROW 1: StatCards -->
    <div class="gap-6 grid md:grid-cols-2 lg:grid-cols-4">
      <StatCard :title="t('overview.users.title')" :value="overviewData?.users ?? 0" :icon="Users"
        :trend="overviewData?.usersChange ?? 0" :trend-label="t('overview.users.change')"
        :loading="isOverviewLoading" />
      <StatCard :title="t('overview.jobs.title')" :value="overviewData?.jobs ?? 0" :icon="Briefcase"
        :trend="overviewData?.jobsChange ?? 0" :trend-label="t('overview.jobs.change')" :loading="isOverviewLoading" />
      <StatCard :title="t('overview.companies.title')" :value="overviewData?.companies ?? 0" :icon="Building2"
        :loading="isOverviewLoading" />
      <StatCard :title="t('overview.news.title')" :value="overviewData?.news ?? 0" :icon="Newspaper"
        :loading="isOverviewLoading" />
    </div>
    <Alert v-if="isOverviewError" variant="destructive">
      <AlertTitle>{{ t('overview.error') }}</AlertTitle>
      <AlertDescription class="flex justify-between items-center">
        <span>{{ t('overview.error') }}</span>
        <Button variant="outline" size="sm" @click="overviewRefetch">{{ t('overview.retry') }}</Button>
      </AlertDescription>
    </Alert>

    <!-- ROW 2: Charts -->
    <div class="gap-6 grid md:grid-cols-2">
      <LineChart :title="t('overview.charts.registrations')"
        :series="[{ name: t('overview.charts.registrations'), data: registrationsData?.map(d => d.count) || [] }]"
        :x-labels="registrationsData?.map(d => d.date) || []" :loading="isRegistrationsLoading" />
      <BarChart :title="t('overview.charts.jobsPerWeek')"
        :data="jobsTimelineData?.map(d => ({ label: d.week, value: d.count })) || []"
        :loading="isJobsTimelineLoading" />
    </div>

    <!-- ROW 3: Mixed -->
    <div class="gap-6 grid md:grid-cols-3">
      <DonutChart :title="t('overview.charts.loginMethods')"
        :data="loginMethodsData?.map(d => ({ name: d.method, value: d.count })) || []"
        :loading="isLoginMethodsLoading" />
      <TopList :title="t('overview.charts.topSkills')"
        :items="topSkillsData?.map(d => ({ label: d.skill, count: d.count })) || []" :loading="isTopSkillsLoading" />
      <TopList :title="t('overview.charts.topLanguages')"
        :items="topLanguagesData?.map(d => ({ label: d.language, count: d.count })) || []"
        :loading="isTopLanguagesLoading" />
    </div>

    <!-- ROW 4: DataTables -->
    <div class="gap-6 grid lg:grid-cols-2">
      <div class="space-y-4">
        <h3 class="font-semibold text-xl">{{ t('overview.tables.latestJobs') }}</h3>
        <DataTable :columns="(jobsColumns as any)" :data="(latestJobsData?.data as any) || []"
          :loading="isLatestJobsLoading" />
      </div>
      <div class="space-y-4">
        <h3 class="font-semibold text-xl">{{ t('overview.tables.latestUsers') }}</h3>
        <DataTable :columns="(usersColumns as any)" :data="(latestUsersData?.data as any) || []"
          :loading="isLatestUsersLoading" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ColumnDef } from '@tanstack/vue-table'

import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, Users, Briefcase, Building2, Newspaper } from 'lucide-vue-next'

import StatCard from '@/components/organisms/StatCard.vue'
import LineChart from '@/components/organisms/charts/LineChart.vue'
import BarChart from '@/components/organisms/charts/BarChart.vue'
import DonutChart from '@/components/organisms/charts/DonutChart.vue'
import TopList from '@/components/organisms/TopList.vue'
import DataTable from '@/components/organisms/DataTable.vue'

import { analyticsService } from '@/services/analytics.service'
import { jobsService } from '@/services/jobs.service'
import { usersService } from '@/services/users.service'

import type { Job, User } from '@/types/api'

const { t } = useI18n()
const queryClient = useQueryClient()
const isRefreshing = ref(false)

const staleTime = 5 * 60 * 1000 // 5 minuti

// Queries
const { data: overviewData, isLoading: isOverviewLoading, isError: isOverviewError, refetch: overviewRefetch } = useQuery({
  queryKey: ['overviewStats'],
  queryFn: () => analyticsService.getOverviewStats(),
  staleTime
})

const { data: registrationsData, isLoading: isRegistrationsLoading } = useQuery({
  queryKey: ['registrationsTimeline'],
  queryFn: () => analyticsService.getRegistrationsTimeline(30),
  staleTime
})

const { data: jobsTimelineData, isLoading: isJobsTimelineLoading } = useQuery({
  queryKey: ['jobsTimeline'],
  queryFn: () => analyticsService.getJobsTimeline(8),
  staleTime
})

const { data: loginMethodsData, isLoading: isLoginMethodsLoading } = useQuery({
  queryKey: ['loginMethods'],
  queryFn: () => analyticsService.getLoginMethodsDistribution(),
  staleTime
})

const { data: topSkillsData, isLoading: isTopSkillsLoading } = useQuery({
  queryKey: ['topSkills'],
  queryFn: () => analyticsService.getTopSkills(10),
  staleTime
})

const { data: topLanguagesData, isLoading: isTopLanguagesLoading } = useQuery({
  queryKey: ['topLanguages'],
  queryFn: () => analyticsService.getTopLanguages(10),
  staleTime
})

const { data: latestJobsData, isLoading: isLatestJobsLoading } = useQuery({
  queryKey: ['latestJobs'],
  queryFn: () => jobsService.getJobs({ limit: 10 }),
  staleTime
})

const { data: latestUsersData, isLoading: isLatestUsersLoading } = useQuery({
  queryKey: ['latestUsers'],
  queryFn: () => usersService.getUsers({ limit: 10 }),
  staleTime
})

const refreshAll = async () => {
  isRefreshing.value = true
  await queryClient.invalidateQueries()
  isRefreshing.value = false
}

// Columns definition for simple summary tables
const jobsColumns = computed<ColumnDef<Job, unknown>[]>(() => [
  { accessorKey: 'title', header: t('jobsList.columns.title') },
  { accessorKey: 'company.name', header: t('companies.title'), cell: ({ row }) => row.original.company?.name || '-' },
  { accessorKey: 'employment_type', header: t('jobsList.columns.type') },
  { accessorKey: 'status', header: t('jobsList.columns.status') }
])

const usersColumns = computed<ColumnDef<User, unknown>[]>(() => [
  { accessorKey: 'firstName', header: t('users.columns.user'), cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}` },
  { accessorKey: 'email', header: t('users.columns.email') },
  { accessorKey: 'role', header: t('users.columns.method') },
])
</script>
