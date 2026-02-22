<script setup lang="ts">
import { computed } from "vue";
import { ArrowDownRight, ArrowUpRight } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  title: string;
  value: string | number;
  change?: number;
  icon?: unknown;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

const trend = computed(() => {
  if (props.change === undefined || props.change === null) return null;
  return props.change >= 0 ? "up" : "down";
});

const formattedChange = computed(() => {
  if (props.change === undefined || props.change === null) return "";
  return `${Math.abs(props.change)}%`;
});
</script>

<template>
  <Card data-testid="stat-card" :aria-label="t(title)" class="stat-card">
    <CardHeader class="stat-header">
      <span class="stat-label">{{ t(title) }}</span>
      <component v-if="icon" :is="icon" class="icon-sm icon-muted" />
    </CardHeader>
    <CardContent>
      <div class="stack-sm">
        <div v-if="loading" class="stack-sm">
          <Skeleton class="h-8 w-24" data-testid="stat-loading" />
          <Skeleton class="h-4 w-16" />
        </div>
        <div v-else class="stack-xs">
          <div class="stat-value" data-testid="stat-value">{{ value }}</div>
          <div v-if="trend" class="stat-change" data-testid="stat-change">
            <ArrowUpRight v-if="trend === 'up'" class="icon-sm icon-brand" />
            <ArrowDownRight v-else class="icon-sm icon-danger" />
            <span :class="trend === 'up' ? 'stat-change-up' : 'stat-change-down'">
              {{ formattedChange }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
