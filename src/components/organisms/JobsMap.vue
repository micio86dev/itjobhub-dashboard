<script setup lang="ts">
import { shallowRef, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import type { JobListItem } from '@/api'
import type { MapFiltersState } from './MapFilters.vue'
import { useTheme } from '@/composables/useTheme'
import { subDays, parseISO, isAfter } from 'date-fns'
import { getCSSVar } from '@/utils/chartColors'

const props = withDefaults(
  defineProps<{
    jobs: JobListItem[]
    filters: MapFiltersState
  }>(),
  {
    filters: () => ({
      skills: [],
      remote: null,
      company: null,
      contractType: null,
      experienceLevel: null,
      publishedWithin: null,
    }),
  },
)

const emit = defineEmits<{ 'select-job': [job: JobListItem] }>()

const { t } = useI18n()
const { theme } = useTheme()
const mapRef = shallowRef<HTMLDivElement | null>(null)
const mapInstance = shallowRef<google.maps.Map | null>(null)
const clusterer = shallowRef<MarkerClusterer | null>(null)
let markers: google.maps.marker.AdvancedMarkerElement[] = []
let infoWindow: google.maps.InfoWindow | null = null

// Compute filtered jobs
const filteredJobs = computed(() => {
  return props.jobs.filter((job) => {
    if (!job.location_geo) return false

    if (props.filters.remote && job.workMode !== props.filters.remote) return false
    if (props.filters.company && job.company?.name !== props.filters.company) return false
    if (props.filters.contractType && job.contractType !== props.filters.contractType) return false
    if (props.filters.experienceLevel && job.seniority !== props.filters.experienceLevel) return false
    if (
      props.filters.publishedWithin &&
      job.created_at
    ) {
      const threshold = subDays(new Date(), props.filters.publishedWithin)
      if (!isAfter(parseISO(job.created_at), threshold)) return false
    }
    if (props.filters.skills.length > 0) {
      const hasSkill = props.filters.skills.some((s) => job.skills.includes(s))
      if (!hasSkill) return false
    }

    return true
  })
})

defineExpose({ filteredCount: computed(() => filteredJobs.value.length) })

function getMarkerColor(job: JobListItem): string {
  if (job.workMode === 'remote') return getCSSVar('--c-primary')
  if (job.workMode === 'hybrid') return getCSSVar('--c-chart-secondary')
  return getCSSVar('--c-text-muted')
}

function rebuildMarkers() {
  if (!mapInstance.value) return

  // Cleanup existing
  markers.forEach((m) => { m.map = null })
  markers = []
  clusterer.value?.clearMarkers()

  if (infoWindow) {
    infoWindow.close()
  }
  infoWindow = new google.maps.InfoWindow()

  markers = filteredJobs.value.map((job) => {
    const coords = job.location_geo!.coordinates
    // GeoJSON: [lng, lat]
    const position = { lat: coords[1]!, lng: coords[0]! }

    const dot = document.createElement('div')
    dot.style.cssText = `
      width: 14px; height: 14px; border-radius: 50%;
      background: ${getMarkerColor(job)};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
    `

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      map: mapInstance.value!,
      content: dot,
      title: job.title,
    })

    marker.addListener('click', () => {
      const textMuted = getCSSVar('--c-text-muted')
      const primary = getCSSVar('--c-primary')

      const content = `
        <div style="max-width:240px;padding:4px 2px;">
          <strong style="font-size:13px;">${job.title}</strong>
          <p style="margin:4px 0;font-size:12px;color:${textMuted};">${job.company?.name ?? ''}</p>
          <p style="margin:4px 0;font-size:11px;">${job.workMode ?? ''} · ${job.contractType ?? ''}</p>
          ${job.source_url ? `<a href="${job.source_url}" target="_blank" style="font-size:11px;color:${primary};">${t('map.viewDetail')} ↗</a>` : ''}
        </div>
      `
      infoWindow!.setContent(content)
      infoWindow!.open(mapInstance.value, marker)
      emit('select-job', job)
    })

    return marker
  })

  clusterer.value = new MarkerClusterer({
    map: mapInstance.value,
    markers,
    algorithm: new SuperClusterAlgorithm({ radius: 80 }),
  })
}

onMounted(async () => {
  const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_KEY as string | undefined
  if (!apiKey) return

  setOptions({ key: apiKey })
  await importLibrary('maps')
  await importLibrary('marker')

  mapInstance.value = new google.maps.Map(mapRef.value!, {
    center: { lat: 41.9, lng: 12.5 },
    zoom: 6,
    mapId: 'devboards_admin',
    disableDefaultUI: false,
    colorScheme: theme.value === 'dark' ? 'DARK' : 'LIGHT',
  })

  rebuildMarkers()
})

onUnmounted(() => {
  markers.forEach((m) => { m.map = null })
  clusterer.value?.clearMarkers()
})

watch(filteredJobs, rebuildMarkers)
watch(theme, () => {
  if (mapInstance.value) {
    mapInstance.value.setOptions({
      colorScheme: theme.value === 'dark' ? 'DARK' : 'LIGHT',
    })
  }
})
</script>

<template>
  <div ref="mapRef" data-testid="jobs-map" class="jobs-map" />
</template>

<style scoped>
.jobs-map {
  height: 100%;
  width: 100%;
  border-radius: var(--r-card);
  min-height: 400px;
}
</style>
