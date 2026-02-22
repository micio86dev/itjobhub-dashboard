<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/organisms/StatCard.vue";
import DataTable from "@/components/organisms/DataTable.vue";
import TopList from "@/components/organisms/TopList.vue";
import LineChart from "@/components/organisms/charts/LineChart.vue";
import BarChart from "@/components/organisms/charts/BarChart.vue";
import DonutChart from "@/components/organisms/charts/DonutChart.vue";
import {
  getJobsTimeline,
  getLoginMethodsDistribution,
  getOverviewStats,
  getRegistrationsTimeline,
  getTopLanguages,
  getTopSkills,
} from "@/services/analytics.service";
import { getJobs } from "@/services/jobs.service";
import { getUsers } from "@/services/users.service";
import type { Job, User } from "@/types/api";

const { t } = useI18n();
const queryClient = useQueryClient();

const statsQuery = useQuery({
  queryKey: ["overview", "stats"],
  queryFn: () => getOverviewStats(),
  staleTime: 1000 * 60 * 5,
});

const registrationsQuery = useQuery({
  queryKey: ["overview", "registrations"],
  queryFn: () => getRegistrationsTimeline(30),
  staleTime: 1000 * 60 * 5,
});

const jobsTimelineQuery = useQuery({
  queryKey: ["overview", "jobs-timeline"],
  queryFn: () => getJobsTimeline(8),
  staleTime: 1000 * 60 * 5,
});

const loginMethodsQuery = useQuery({
  queryKey: ["overview", "login-methods"],
  queryFn: () => getLoginMethodsDistribution(),
  staleTime: 1000 * 60 * 5,
});

const topSkillsQuery = useQuery({
  queryKey: ["overview", "top-skills"],
  queryFn: () => getTopSkills(10),
  staleTime: 1000 * 60 * 5,
});

const topLanguagesQuery = useQuery({
  queryKey: ["overview", "top-languages"],
  queryFn: () => getTopLanguages(10),
  staleTime: 1000 * 60 * 5,
});

const recentJobsQuery = useQuery({
  queryKey: ["overview", "recent-jobs"],
  queryFn: () => getJobs({ page: 1, limit: 10 }),
  staleTime: 1000 * 60,
});

const recentUsersQuery = useQuery({
  queryKey: ["overview", "recent-users"],
  queryFn: () => getUsers({ page: 1, limit: 10 }),
  staleTime: 1000 * 60,
});

const registrationsChart = computed(() => {
  const data = registrationsQuery.data.value ?? [];
  return {
    labels: data.map((item) => item.date ?? ""),
    series: [{ name: t("overview.charts.registrations"), data: data.map((item) => item.count) }],
  };
});

const jobsChart = computed(() => {
  const data = jobsTimelineQuery.data.value ?? [];
  return {
    labels: data.map((item) => item.week ?? ""),
    values: data.map((item) => item.count),
  };
});

const loginChartData = computed(() =>
  (loginMethodsQuery.data.value ?? []).map((item) => ({
    name: item.method,
    value: item.count,
  })),
);

const topSkills = computed(() =>
  (topSkillsQuery.data.value ?? []).map((item) => ({
    label: item.skill,
    count: item.count,
  })),
);

const topLanguages = computed(() =>
  (topLanguagesQuery.data.value ?? []).map((item) => ({
    label: item.language,
    count: item.count,
  })),
);

const jobsColumns: ColumnDef<Job>[] = [
  { accessorKey: "title", header: () => t("jobs.table.title") },
  {
    id: "company",
    header: () => t("companies.title"),
    cell: ({ row }) => row.original.company?.name ?? t("common.placeholder"),
  },
  {
    accessorKey: "employment_type",
    header: () => t("jobs.table.type"),
    cell: ({ row }) => row.original.employment_type ?? t("common.placeholder"),
  },
  {
    accessorKey: "published_at",
    header: () => t("jobs.table.published"),
    cell: ({ row }) => row.original.published_at ?? t("common.placeholder"),
  },
];

const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "first_name",
    header: () => t("users.table.name"),
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`.trim(),
  },
  { accessorKey: "email", header: () => t("users.table.email") },
  { accessorKey: "oauth_provider", header: () => t("users.table.method") },
  {
    accessorKey: "created_at",
    header: () => t("users.table.created"),
    cell: ({ row }) => row.original.created_at ?? t("common.placeholder"),
  },
];

const updatedAt = computed(() => format(new Date(), "HH:mm"));

function refreshAll() {
  queryClient.invalidateQueries({ queryKey: ["overview"] });
}
</script>

<template>
  <section class="page-container" data-testid="overview-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">{{ t("overview.title") }}</h2>
        <p class="page-subtitle">
          {{ t("common.updatedAt", { time: updatedAt }) }}
        </p>
      </div>
      <Button variant="outline" size="sm" @click="refreshAll">
        {{ t("common.refresh") }}
      </Button>
    </div>

    <div class="stats-grid">
      <StatCard
        :title="'overview.stats.users'"
        :value="statsQuery.data.value?.users ?? 0"
        :change="statsQuery.data.value?.usersChange"
        :loading="statsQuery.isLoading.value"
      />
      <StatCard
        :title="'overview.stats.jobs'"
        :value="statsQuery.data.value?.jobs ?? 0"
        :change="statsQuery.data.value?.jobsChange"
        :loading="statsQuery.isLoading.value"
      />
      <StatCard
        :title="'overview.stats.companies'"
        :value="statsQuery.data.value?.companies ?? 0"
        :loading="statsQuery.isLoading.value"
      />
      <StatCard
        :title="'overview.stats.news'"
        :value="statsQuery.data.value?.news ?? 0"
        :loading="statsQuery.isLoading.value"
      />
    </div>

    <div class="charts-grid-2">
      <LineChart
        :title="'overview.charts.registrations'"
        :series="registrationsChart.series"
        :x-labels="registrationsChart.labels"
        :loading="registrationsQuery.isLoading.value"
      />
      <BarChart
        :title="'overview.charts.jobsPerWeek'"
        :data="
          jobsChart.labels.map((label, index) => ({ label, value: jobsChart.values[index] ?? 0 }))
        "
        :loading="jobsTimelineQuery.isLoading.value"
      />
    </div>

    <div class="charts-grid-3">
      <DonutChart
        :title="'overview.charts.loginMethods'"
        :data="loginChartData"
        :loading="loginMethodsQuery.isLoading.value"
      />
      <TopList
        :title="'overview.lists.topSkills'"
        :items="topSkills"
        :loading="topSkillsQuery.isLoading.value"
      />
      <TopList
        :title="'overview.lists.topLanguages'"
        :items="topLanguages"
        :loading="topLanguagesQuery.isLoading.value"
      />
    </div>

    <div class="charts-grid-2">
      <div class="stack-sm">
        <h3 class="text-section-title">{{ t("overview.tables.recentJobs") }}</h3>
        <DataTable
          :columns="jobsColumns"
          :data="recentJobsQuery.data.value?.data ?? []"
          :loading="recentJobsQuery.isLoading.value"
          :searchable="false"
          :selectable="false"
        />
      </div>
      <div class="stack-sm">
        <h3 class="text-section-title">{{ t("overview.tables.recentUsers") }}</h3>
        <DataTable
          :columns="usersColumns"
          :data="recentUsersQuery.data.value?.data ?? []"
          :loading="recentUsersQuery.isLoading.value"
          :searchable="false"
          :selectable="false"
        />
      </div>
    </div>
  </section>
</template>
