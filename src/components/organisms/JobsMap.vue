<template>
  <div class="relative border rounded-lg w-full h-full min-h-[500px] overflow-hidden" data-testid="jobs-map">
    <div ref="mapContainer" class="absolute inset-0 w-full h-full"></div>
    <div v-if="loading" class="z-10 absolute inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-2">
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
        <span class="font-medium text-sm">Caricamento mappa...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference types="google.maps" />
import { ref, onMounted, watch, computed, shallowRef } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import { useTheme } from '@/composables/useTheme'

interface JobLocation {
  type: string
  coordinates: [number, number] // [lng, lat]
  address: string
}

export interface MapJob {
  _id: string
  title: string
  company_name: string
  contract_type: string
  experience_level: string
  remote_status: string
  published_at: string
  location?: JobLocation
}

const props = defineProps<{
  jobs: MapJob[]
  filters: Record<string, unknown>
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-job', job: MapJob): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<google.maps.Map | null>(null)
const clusterer = shallowRef<MarkerClusterer | null>(null)
const markers = shallowRef<google.maps.marker.AdvancedMarkerElement[]>([])

const { theme } = useTheme()
const isDark = computed(() => {
  if (theme.value === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches
  return theme.value === 'dark'
})

// Filter logic
const filteredJobs = computed(() => {
  return props.jobs.filter(job => {
    if (props.filters.remote !== 'all' && job.remote_status !== props.filters.remote) return false
    if (props.filters.contractType !== 'all' && job.contract_type !== props.filters.contractType) return false
    if (props.filters.experienceLevel !== 'all' && job.experience_level !== props.filters.experienceLevel) return false
    
    if (props.filters.publishedWithin !== 'all') {
      const days = parseInt(props.filters.publishedWithin as string)
      const date = new Date(job.published_at)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > days) return false
    }

    return true
  }).filter(j => j.location && j.location.coordinates && j.location.coordinates.length === 2)
})

const getMarkerColor = (remoteStatus: string) => {
  switch (remoteStatus) {
    case 'remote': return '#22c55e'
    case 'hybrid': return '#3b82f6'
    default: return '#71717a'
  }
}

const createMap = async () => {
  if (!mapContainer.value) return

  setOptions({
    key: import.meta.env.PUBLIC_GOOGLE_MAPS_KEY || '',
    v: 'weekly',
  })

  const { Map } = await importLibrary('maps')

  map.value = new Map(mapContainer.value, {
    center: { lat: 41.8719, lng: 12.5674 }, // Italy 
    zoom: 6,
    mapId: import.meta.env.PUBLIC_GOOGLE_MAPS_ID || 'DEMO_MAP_ID',
    disableDefaultUI: true,
    zoomControl: true,
  })

  clusterer.value = new MarkerClusterer({
    map: map.value,
    algorithm: new SuperClusterAlgorithm({ radius: 60 })
  })

  updateMarkers()
}

const updateTheme = () => {
  // We can push style changes if needed, but modern Google Maps uses mapId for styling
  // We'll rely on the Google cloud console styles associated with the MAP_ID if set.
}

watch(isDark, () => {
  updateTheme()
})

const updateMarkers = async () => {
  if (!map.value || !clusterer.value) return

  // Clear existing markers
  markers.value.forEach(m => (m.map = null))
  clusterer.value.clearMarkers()
  
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary
  const infoWindow = new google.maps.InfoWindow()

  const newMarkers = filteredJobs.value.map(job => {
    const [lng, lat] = job.location!.coordinates

    const pin = new PinElement({
      background: getMarkerColor(job.remote_status),
      borderColor: '#ffffff',
      glyphColor: '#ffffff'
    })

    const marker = new AdvancedMarkerElement({
      position: { lat, lng },
      content: pin.element,
      title: job.title
    })

    marker.addListener('click', () => {
      const content = `
        <div style="color: black; padding: 4px; max-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${job.title}</h3>
          <p style="font-size: 13px; margin-bottom: 2px;">${job.company_name}</p>
          <p style="font-size: 11px; margin-bottom: 8px; color: #666;">${job.contract_type} • ${job.remote_status}</p>
          <button id="btn-${job._id}" style="color: #22c55e; cursor: pointer; border: none; background: none; font-weight: 500;">
            Vedi dettaglio
          </button>
        </div>
      `
      infoWindow.setContent(content)
      infoWindow.open({
        anchor: marker,
        map: map.value,
      })

      // Attach click listener to button inside infowindow once dom is ready
      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById(`btn-${job._id}`)?.addEventListener('click', () => {
          emit('select-job', job)
        })
      })
    })

    return marker
  })

  markers.value = newMarkers
  clusterer.value.addMarkers(newMarkers)
}

watch(filteredJobs, () => {
  updateMarkers()
}, { deep: true })

onMounted(() => {
  createMap()
})
</script>
