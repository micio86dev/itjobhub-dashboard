<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TopListItem {
  label: string;
  count: number;
  extra?: string;
}

interface Props {
  title: string;
  items: TopListItem[];
  loading?: boolean;
  maxItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  maxItems: 10,
});

const { t } = useI18n();

const visibleItems = computed(() => props.items.slice(0, props.maxItems));
const extraCount = computed(() => Math.max(0, props.items.length - props.maxItems));
const maxValue = computed(() => {
  return visibleItems.value.reduce((max, item) => Math.max(max, item.count), 0) || 1;
});

const progressWidth = (count: number) => `${Math.round((count / maxValue.value) * 100)}%`;
</script>

<template>
  <Card data-testid="top-list">
    <CardHeader class="chart-header">
      <span class="chart-title">{{ t(title) }}</span>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="stack-md">
        <Skeleton v-for="index in 5" :key="index" class="h-5 w-full" />
      </div>
      <div v-else-if="visibleItems.length === 0" class="text-muted-sm">
        {{ t("topList.empty") }}
      </div>
      <div v-else class="stack-md">
        <div
          v-for="(item, index) in visibleItems"
          :key="`${item.label}-${index}`"
          class="top-list-item"
          :data-testid="`top-list-item-${index}`"
        >
          <div class="top-list-row">
            <span class="top-list-index">{{ index + 1 }}.</span>
            <span class="top-list-label">{{ item.label }}</span>
            <span class="top-list-count">{{ item.count }}</span>
          </div>
          <div class="top-list-progress-track">
            <div
              class="top-list-progress-bar"
              data-testid="top-list-progress-bar"
              :style="{ width: progressWidth(item.count) }"
            />
          </div>
        </div>
        <div v-if="extraCount > 0" class="text-muted-sm">
          {{ t("topList.more", { count: extraCount }) }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>
