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
