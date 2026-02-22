<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import type { ColumnDef } from "@tanstack/vue-table";
import BarChart from "@/components/organisms/charts/BarChart.vue";
import DataTable from "@/components/organisms/DataTable.vue";
import { getTopSkills } from "@/services/jobs.service";
import type { TopSkill } from "@/types/api";

const { t } = useI18n();

const topSkillsQuery = useQuery({
  queryKey: ["skills", "top"],
  queryFn: () => getTopSkills(30),
  staleTime: 1000 * 60 * 5,
});

const chartData = computed(() =>
  (topSkillsQuery.data.value ?? []).map((item) => ({
    label: item.skill,
    value: item.count,
  })),
);

const tableData = computed<TopSkill[]>(() => topSkillsQuery.data.value ?? []);

const columns = computed<ColumnDef<TopSkill>[]>(() => [
  { accessorKey: "skill", header: () => t("skills.table.skill") },
  { accessorKey: "count", header: () => t("skills.table.jobs") },
  { accessorKey: "trend", header: () => t("skills.table.trend") },
]);
</script>

<template>
  <section class="page-container" data-testid="skills-page">
    <div class="page-header">
      <h2 class="page-title">{{ t("skills.title") }}</h2>
    </div>

    <div class="charts-grid-2">
      <BarChart
        :title="'skills.charts.topJobs'"
        :data="chartData"
        :horizontal="true"
        :loading="topSkillsQuery.isLoading.value"
      />
      <BarChart
        :title="'skills.charts.topSearches'"
        :data="[]"
        :horizontal="true"
        :loading="true"
      />
    </div>

    <DataTable
      :columns="columns"
      :data="tableData"
      :loading="topSkillsQuery.isLoading.value"
      :searchable="false"
      :selectable="false"
    />
  </section>
</template>
