<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/composables/useTheme";
import Chart from "./chart-setup";

interface Props {
  title: string;
  data: Array<[number, number, number]>;
  xLabels: string[];
  yLabels: string[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: false });
const { t } = useI18n();
const { theme } = useTheme();

const maxValue = computed(() => Math.max(...props.data.map((item) => item[2]), 1));

const chartOptions = computed(() => ({
  tooltip: {
    position: "top",
  },
  grid: {
    height: "60%",
    top: "10%",
  },
  xAxis: {
    type: "category",
    data: props.xLabels,
    splitArea: { show: true },
  },
  yAxis: {
    type: "category",
    data: props.yLabels,
    splitArea: { show: true },
  },
  visualMap: {
    min: 0,
    max: maxValue.value,
    calculable: true,
    orient: "horizontal",
    left: "center",
    bottom: "5%",
    inRange: {
      color: ["#f0fdf4", "#22c55e", "#14532d"],
    },
  },
  series: [
    {
      type: "heatmap",
      data: props.data,
      label: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.3)",
        },
      },
    },
  ],
}));
</script>

<template>
  <Card>
    <CardHeader class="chart-header">
      <span class="chart-title">{{ t(title) }}</span>
    </CardHeader>
    <CardContent>
      <Skeleton v-if="loading" class="chart-container-tall" />
      <Chart v-else class="chart-container-tall" :option="chartOptions" :theme="theme" autoresize />
    </CardContent>
  </Card>
</template>
