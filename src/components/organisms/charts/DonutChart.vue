<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/composables/useTheme";
import Chart from "./chart-setup";

interface DonutItem {
  name: string;
  value: number;
}

interface Props {
  title: string;
  data: DonutItem[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: false });
const { t } = useI18n();
const { theme } = useTheme();

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0));

const chartOptions = computed(() => ({
  tooltip: { trigger: "item" },
  legend: { bottom: 0 },
  title: {
    text: String(total.value),
    left: "center",
    top: "center",
    textStyle: { fontSize: 18, fontWeight: "bold" },
  },
  series: [
    {
      type: "pie",
      radius: ["55%", "75%"],
      avoidLabelOverlap: false,
      label: { show: false },
      data: props.data,
      color: ["#22c55e", "#a1a1aa", "#71717a", "#d4d4d8"],
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
      <Skeleton v-if="loading" class="chart-container" />
      <Chart v-else class="chart-container" :option="chartOptions" :theme="theme" autoresize />
    </CardContent>
  </Card>
</template>
