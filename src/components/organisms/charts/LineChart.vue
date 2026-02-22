<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/composables/useTheme";
import Chart from "./chart-setup";

interface SeriesItem {
  name: string;
  data: number[];
}

interface Props {
  title: string;
  series: SeriesItem[];
  xLabels: string[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: false });
const { t } = useI18n();
const { theme } = useTheme();

const chartOptions = computed(() => ({
  tooltip: { trigger: "axis" },
  legend: { show: props.series.length > 1 },
  grid: { left: 24, right: 24, top: 24, bottom: 24, containLabel: true },
  xAxis: {
    type: "category",
    data: props.xLabels,
    boundaryGap: false,
  },
  yAxis: { type: "value" },
  series: props.series.map((item) => ({
    name: item.name,
    type: "line",
    smooth: true,
    data: item.data,
    areaStyle: { opacity: 0.2 },
    lineStyle: { width: 2, color: "#22c55e" },
    itemStyle: { color: "#22c55e" },
  })),
}));
</script>

<template>
  <Card>
    <CardHeader class="chart-header">
      <span class="chart-title">{{ t(title) }}</span>
    </CardHeader>
    <CardContent>
      <Skeleton v-if="loading" class="chart-container" />
      <Chart v-else class="chart-container" :option="chartOptions" :theme="theme" autoresize />
    </CardContent>
  </Card>
</template>
