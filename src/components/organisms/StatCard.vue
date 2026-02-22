<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    change?: number
    icon?: Component
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const changePositive = computed(() => (props.change ?? 0) >= 0)
const changeClass = computed(() => changePositive.value ? 'trend-up' : 'trend-down')
const changeLabel = computed(() => {
  if (props.change === undefined) return ''
  const sign = props.change >= 0 ? '+' : ''
  return `${sign}${props.change.toFixed(1)}%`
})
</script>

<template>
  <div data-testid="stat-card" class="card stat-card">

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="skeleton stat-skeleton-title" />
      <div class="skeleton stat-skeleton-value" />
      <div class="skeleton stat-skeleton-change" />
    </template>

    <!-- Content -->
    <template v-else>
      <div class="stat-header">
        <p class="stat-label">{{ title }}</p>
        <component :is="icon" v-if="icon" class="h-5 w-5 stat-icon" />
      </div>

      <p data-testid="stat-value" class="stat-value">
        {{ value.toLocaleString() }}
      </p>

      <div
        v-if="change !== undefined"
        data-testid="stat-change"
        class="stat-change"
        :class="changeClass"
      >
        <TrendingUp v-if="changePositive" class="h-4 w-4" />
        <TrendingDown v-else class="h-4 w-4" />
        <span>{{ changeLabel }} {{ t('common.vsLastMonth') }}</span>
      </div>
    </template>

  </div>
</template>

<style scoped>
.stat-card {
  transition: var(--transition-shadow);
  &:hover { box-shadow: var(--shadow-hover); }
}

/* ── Header row ── */
.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
}

.stat-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--c-text-muted);
}

.stat-icon {
  color: var(--c-primary);
  flex-shrink: 0;
}

/* ── Value ── */
.stat-value {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--c-text-base);
  line-height: 1;
}

/* ── Trend row ── */
.stat-change {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  margin-top: var(--sp-2);
  font-size: var(--text-sm);
}

.trend-up   { color: var(--color-green-600); }
.trend-down { color: var(--color-red-600); }

.dark .trend-up   { color: var(--color-green-400); }
.dark .trend-down { color: var(--color-red-400); }

/* ── Skeletons ── */
.stat-skeleton-title  { height: 1rem;    width: 6rem;  margin-bottom: var(--sp-3); }
.stat-skeleton-value  { height: 2rem;    width: 5rem;  margin-bottom: var(--sp-2); }
.stat-skeleton-change { height: 1rem;    width: 4rem;  }
</style>
