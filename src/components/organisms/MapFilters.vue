<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RotateCcw } from 'lucide-vue-next'

export interface MapFiltersState {
  skills: string[]
  remote: 'remote' | 'hybrid' | 'onsite' | null
  company: string | null
  contractType: string | null
  experienceLevel: string | null
  publishedWithin: 7 | 30 | 90 | null
}

defineProps<{
  jobsCount: number
  availableSkills?: string[]
  availableCompanies?: string[]
}>()

const emit = defineEmits<{
  'update:filters': [filters: MapFiltersState]
}>()

const { t } = useI18n()

const filters = reactive<MapFiltersState>({
  skills: [],
  remote: null,
  company: null,
  contractType: null,
  experienceLevel: null,
  publishedWithin: null,
})

const workModes = computed(() => [
  { value: null, label: t('common.all') },
  { value: 'remote', label: t('jobs.workMode.remote') },
  { value: 'hybrid', label: t('jobs.workMode.hybrid') },
  { value: 'onsite', label: t('jobs.workMode.onsite') },
])

const publishedOptions = computed(() => [
  { value: null, label: t('common.all') },
  { value: 7, label: t('map.days7') },
  { value: 30, label: t('map.days30') },
  { value: 90, label: t('map.days90') },
])

function resetFilters() {
  filters.skills = []
  filters.remote = null
  filters.company = null
  filters.contractType = null
  filters.experienceLevel = null
  filters.publishedWithin = null
}

watch(filters, () => {
  emit('update:filters', { ...filters })
}, { deep: true })
</script>

<template>
  <div class="filters-panel">

    <!-- Jobs count -->
    <div class="jobs-count-box">
      <p class="jobs-count-value">
        {{ jobsCount.toLocaleString() }}
        <span class="jobs-count-label">{{ $t('map.jobsFound') }}</span>
      </p>
    </div>

    <!-- Work mode filter -->
    <div class="filter-group">
      <label class="form-label-xs">{{ $t('map.filterWorkMode') }}</label>
      <div class="pill-group">
        <button
          v-for="mode in workModes"
          :key="String(mode.value)"
          class="pill-filter"
          :class="{ 'is-active': filters.remote === mode.value }"
          @click="filters.remote = mode.value as MapFiltersState['remote']"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <!-- Published within -->
    <div class="filter-group">
      <label class="form-label-xs">{{ $t('map.filterPublished') }}</label>
      <select v-model="filters.publishedWithin" class="form-select">
        <option v-for="opt in publishedOptions" :key="String(opt.value)" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Company filter -->
    <div v-if="availableCompanies && availableCompanies.length > 0" class="filter-group">
      <label class="form-label-xs">{{ $t('map.filterCompany') }}</label>
      <select v-model="filters.company" class="form-select">
        <option :value="null">{{ $t('common.all') }}</option>
        <option v-for="c in availableCompanies" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- Reset -->
    <button class="btn-outline reset-btn" @click="resetFilters">
      <RotateCcw class="h-4 w-4" />
      {{ $t('map.resetFilters') }}
    </button>

  </div>
</template>

<style scoped>
.filters-panel {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  padding: var(--sp-4);
}

.jobs-count-box {
  border-radius: var(--r-base);
  background-color: var(--c-primary-surface);
  padding: var(--sp-3) var(--sp-4);
}

.jobs-count-value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--c-primary-text);
}

.jobs-count-label {
  font-size: var(--text-sm);
  font-weight: 400;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-top: var(--sp-1\.5);
}

.reset-btn {
  margin-top: auto;
  width: 100%;
  justify-content: center;
}
</style>
