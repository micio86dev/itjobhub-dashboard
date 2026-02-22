<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import BarChart from "@/components/organisms/charts/BarChart.vue";
import HeatmapChart from "@/components/organisms/charts/HeatmapChart.vue";
import LineChart from "@/components/organisms/charts/LineChart.vue";
import { getTopSkills } from "@/services/jobs.service";

const { t } = useI18n();

const topSkillsQuery = useQuery({
  queryKey: ["analytics", "top-skills"],
  queryFn: () => getTopSkills(20),
  staleTime: 1000 * 60 * 5,
});

const topSkillsChart = computed(() =>
  (topSkillsQuery.data.value ?? []).map((item) => ({
    label: item.skill,
    value: item.count,
  })),
);
</script>

<template>
  <section class="page-container" data-testid="analytics-page">
    <div class="page-header">
      <h2 class="page-title">{{ t("analytics.title") }}</h2>
    </div>

    <div class="charts-grid-2">
      <LineChart
        :title="'overview.charts.registrations'"
        :series="[{ name: t('overview.charts.registrations'), data: [] }]"
        :x-labels="[]"
        :loading="true"
      />
      <HeatmapChart
        :title="'analytics.title'"
        :data="[]"
        :x-labels="[]"
        :y-labels="[]"
        :loading="true"
      />
    </div>

    <div class="charts-grid-2">
      <BarChart
        :title="'skills.charts.topJobs'"
        :data="topSkillsChart"
        :horizontal="true"
        :loading="topSkillsQuery.isLoading.value"
      />
      <div class="placeholder-box">
        {{ t("analytics.placeholder") }}
      </div>
    </div>
  </section>
</template>
