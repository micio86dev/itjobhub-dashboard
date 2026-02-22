<script setup lang="ts">
import { shallowRef, reactive } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import JobsMap from '@/components/organisms/JobsMap.vue'
import MapFilters from '@/components/organisms/MapFilters.vue'
import type { MapFiltersState } from '@/components/organisms/MapFilters.vue'
import { jobsService } from '@/services/jobs.service'

const { data: jobs, isPending } = useQuery({
  queryKey: ['jobs-with-location'],
  queryFn: () => jobsService.getJobsWithLocation(),
})

const filters = reactive<MapFiltersState>({
  skills: [],
  remote: null,
  company: null,
  contractType: null,
  experienceLevel: null,
  publishedWithin: null,
})

const mapRef = shallowRef<InstanceType<typeof JobsMap> | null>(null)

function onFiltersUpdate(f: MapFiltersState) {
  Object.assign(filters, f)
}
</script>

<template>
  <div class="map-page">

    <!-- Sidebar filtri -->
    <aside class="map-sidebar">
      <div class="map-sidebar-header">
        <h2 class="map-sidebar-title">{{ $t('map.title') }}</h2>
      </div>
      <MapFilters
        :jobs-count="mapRef?.filteredCount ?? (jobs?.length ?? 0)"
        @update:filters="onFiltersUpdate"
      />
    </aside>

    <!-- Map -->
    <div class="map-panel">
      <div v-if="isPending" class="map-loading">
        <p class="map-loading-text">{{ $t('common.loading') }}</p>
      </div>
      <JobsMap
        v-else
        ref="mapRef"
        :jobs="jobs ?? []"
        :filters="filters"
      />
    </div>

  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  height: calc(100vh - 7rem);
  gap: 1rem;
}

.map-sidebar {
  display: none;
  width: 20rem;
  flex-shrink: 0;
  overflow-y: auto;
  border-radius: var(--r-card);
  border: 1px solid var(--c-border);
  background-color: var(--c-surface);
}

@media (min-width: 1024px) {
  .map-sidebar { display: block; }
}

.map-sidebar-header {
  border-bottom: 1px solid var(--c-border);
  padding: 1rem;
}

.map-sidebar-title {
  font-weight: 600;
  color: var(--c-text-base);
}

.map-panel {
  flex: 1;
  overflow: hidden;
  border-radius: var(--r-card);
}

.map-loading {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-card);
  background-color: var(--c-surface-raised);
}

.map-loading-text {
  color: var(--c-text-muted);
}
</style>
