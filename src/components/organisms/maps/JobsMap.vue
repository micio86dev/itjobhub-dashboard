<script setup lang="ts">
/// <reference types="google.maps" />
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import type { Job } from "@/types/api";
import { useTheme } from "@/composables/useTheme";
import type { MapFiltersState } from "./MapFilters.vue";

interface Props {
  jobs: Job[];
  filters: MapFiltersState;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (event: "select-job", value: Job): void }>();

const { t } = useI18n();
const { theme } = useTheme();

const mapElement = ref<HTMLDivElement | null>(null);
const mapInstance = shallowRef<google.maps.Map | null>(null);
const markers = shallowRef<google.maps.marker.AdvancedMarkerElement[]>([]);
const clusterer = shallowRef<MarkerClusterer | null>(null);
const infoWindow = shallowRef<google.maps.InfoWindow | null>(null);
let AdvancedMarkerElementRef: typeof google.maps.marker.AdvancedMarkerElement | null = null;

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#09090b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#09090b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#e4e4e7" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#27272a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
];

const filteredJobs = computed(() => {
  return props.jobs.filter((job) => {
    if (props.filters.skills.length) {
      const jobSkills = job.skills ?? [];
      const matches = props.filters.skills.some((skill) => jobSkills.includes(skill));
      if (!matches) return false;
    }

    if (props.filters.remote) {
      if (props.filters.remote === "remote" && !job.remote) return false;
      if (props.filters.remote === "onsite" && job.remote) return false;
    }

    if (props.filters.company) {
      const companyId = job.company_id ?? job.company?.id;
      if (companyId !== props.filters.company && job.company?.name !== props.filters.company) {
        return false;
      }
    }

    if (props.filters.contractType && job.employment_type !== props.filters.contractType) {
      return false;
    }

    if (props.filters.experienceLevel && job.experience_level !== props.filters.experienceLevel) {
      return false;
    }

    if (props.filters.publishedWithin && job.published_at) {
      const published = new Date(job.published_at).getTime();
      const limit = Date.now() - props.filters.publishedWithin * 24 * 60 * 60 * 1000;
      if (published < limit) return false;
    }

    return Boolean(job.location_geo?.coordinates?.length);
  });
});

async function initMap() {
  if (!mapElement.value) return;
  setOptions({
    key: import.meta.env.PUBLIC_GOOGLE_MAPS_KEY,
    v: "weekly",
    libraries: ["marker"],
  });

  const mapsLibrary = (await importLibrary("maps")) as google.maps.MapsLibrary;
  const markerLibrary = (await importLibrary("marker")) as google.maps.MarkerLibrary;
  AdvancedMarkerElementRef = markerLibrary.AdvancedMarkerElement;

  const map = new mapsLibrary.Map(mapElement.value, {
    zoom: 4,
    center: { lat: 45.4642, lng: 9.19 },
    styles: theme.value === "dark" ? darkMapStyles : undefined,
  });

  mapInstance.value = map;
  infoWindow.value = new google.maps.InfoWindow();

  createMarkers(AdvancedMarkerElementRef);
}

function clearMarkers() {
  markers.value.forEach((marker) => {
    marker.map = null;
  });
  markers.value = [];
  clusterer.value?.clearMarkers();
  clusterer.value = null;
}

function createMarkers(
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement | null,
) {
  if (!AdvancedMarkerElement) return;
  if (!mapInstance.value) return;
  clearMarkers();

  const newMarkers = filteredJobs.value.map((job) => {
    const [lng, lat] = job.location_geo?.coordinates ?? [0, 0];
    const markerElement = document.createElement("div");
    const markerColor = job.remote ? "#22c55e" : "#a1a1aa";
    markerElement.className = "h-3 w-3 rounded-full";
    markerElement.style.background = markerColor;

    const marker = new AdvancedMarkerElement({
      map: mapInstance.value,
      position: { lat, lng },
      content: markerElement,
      title: job.title,
    });

    marker.addListener("click", () => {
      emit("select-job", job);
      if (!infoWindow.value) return;
      const content = `
        <div style="font-family: Inter, system-ui; font-size: 12px;">
          <strong>${job.title}</strong><br />
          <span>${job.company?.name ?? ""}</span><br />
          <a href="${job.link ?? "#"}" target="_blank" rel="noopener noreferrer">
            ${t("map.viewDetail")}
          </a>
        </div>
      `;
      infoWindow.value.setContent(content);
      infoWindow.value.open({ map: mapInstance.value, anchor: marker });
    });

    return marker;
  });

  markers.value = newMarkers;
  clusterer.value = new MarkerClusterer({
    map: mapInstance.value,
    markers: newMarkers,
    algorithm: new SuperClusterAlgorithm({ radius: 60 }),
  });
}

watch(
  () => [filteredJobs.value, theme.value],
  () => {
    if (!mapInstance.value) return;
    mapInstance.value.setOptions({
      styles: theme.value === "dark" ? darkMapStyles : undefined,
    });
    createMarkers(AdvancedMarkerElementRef);
  },
  { deep: true },
);

onMounted(() => {
  initMap();
});
</script>

<template>
  <div ref="mapElement" data-testid="jobs-map" class="h-full w-full rounded-lg" />
</template>
