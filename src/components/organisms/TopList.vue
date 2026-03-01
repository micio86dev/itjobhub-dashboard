<script setup lang="ts">
import { computed } from 'vue'

interface ListItem {
  label: string
  count: number
  extra?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    items: ListItem[]
    loading?: boolean
  }>(),
  { loading: false },
)

const MAX_ITEMS = 10

const displayed = computed(() => props.items.slice(0, MAX_ITEMS))
const remaining = computed(() => Math.max(0, props.items.length - MAX_ITEMS))
const maxCount = computed(() => Math.max(...displayed.value.map((i) => i.count), 1))
</script>

<template>
  <div class="card">
    <h3 class="list-title">{{ title }}</h3>

    <!-- Skeleton -->
    <template v-if="loading">
      <div v-for="i in 6" :key="i" class="skeleton-row">
        <div class="skeleton skeleton-label" />
        <div class="skeleton skeleton-bar" />
      </div>
    </template>

    <!-- Content -->
    <template v-else>
      <ul class="list-items">
        <li v-for="(item, idx) in displayed" :key="item.label" class="list-item">
          <span class="item-rank">{{ idx + 1 }}</span>
          <div class="item-body">
            <div class="item-row">
              <span class="item-label">{{ item.label }}</span>
              <span class="item-count">{{ item.count.toLocaleString() }}</span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${(item.count / maxCount) * 100}%` }"
              />
            </div>
          </div>
        </li>
      </ul>

      <p v-if="remaining > 0" class="remaining-label">
        {{ $t('common.andOthers', { count: remaining }) }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.list-title {
  margin-bottom: var(--sp-4);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--c-text-secondary);
}

/* ── Skeleton ── */
.skeleton-row {
  margin-bottom: var(--sp-3);
}
.skeleton-label {
  height: 0.75rem;
  width: 8rem;
  margin-bottom: var(--sp-1);
}
.skeleton-bar {
  height: 0.5rem;
  width: 100%;
  border-radius: var(--r-pill);
}

/* ── List ── */
.list-items {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.item-rank {
  width: 1.25rem;
  flex-shrink: 0;
  text-align: right;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--c-text-subtle);
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-bottom: var(--sp-1);
}

.item-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
}

.item-count {
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--c-text-muted);
}

/* ── Progress bar ── */
.progress-track {
  height: 0.375rem;
  width: 100%;
  border-radius: var(--r-pill);
  background-color: var(--c-surface-raised);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--r-pill);
  background-color: var(--c-primary);
  transition: width 300ms ease;
}

/* ── Remaining ── */
.remaining-label {
  margin-top: var(--sp-3);
  font-size: var(--text-xs);
  color: var(--c-text-subtle);
}
</style>
