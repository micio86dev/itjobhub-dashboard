<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/composables/useTheme";
import Chart from "./chart-setup";

interface BarItem {
  label: string;
  value: number;
}

interface Props {
  title: string;
  data: BarItem[];
  horizontal?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { horizontal: false, loading: false });
const { t } = useI18n();
const { theme } = useTheme();

const chartOptions = computed(() => {
  const labels = props.data.map((item) => item.label);
  const values = props.data.map((item) => item.value);

  return {
    tooltip: { trigger: "axis" },
    grid: { left: 24, right: 24, top: 24, bottom: 24, containLabel: true },
    xAxis: props.horizontal ? { type: "value" } : { type: "category", data: labels },
    yAxis: props.horizontal ? { type: "category", data: labels } : { type: "value" },
    series: [
      {
        type: "bar",
        data: values,
        itemStyle: { color: "#22c55e" },
      },
    ],
  };
});
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
