<script setup lang="ts">
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import JobsMap from "@/components/organisms/maps/JobsMap.vue";
import MapFilters, { type MapFiltersState } from "@/components/organisms/maps/MapFilters.vue";
import { getJobsWithLocation } from "@/services/jobs.service";
import { getTopSkills } from "@/services/jobs.service";
import { getCompanies } from "@/services/companies.service";

const { t } = useI18n();

const filters = reactive<MapFiltersState>({
  skills: [],
  remote: null,
  company: null,
  contractType: null,
  experienceLevel: null,
  publishedWithin: null,
});

const jobsQuery = useQuery({
  queryKey: ["jobs-map"],
  queryFn: () => getJobsWithLocation({ page: 1, limit: 500 }),
  staleTime: 1000 * 60 * 5,
});

const skillsQuery = useQuery({
  queryKey: ["jobs-map", "skills"],
  queryFn: () => getTopSkills(200),
  staleTime: 1000 * 60 * 10,
});

const companiesQuery = useQuery({
  queryKey: ["jobs-map", "companies"],
  queryFn: () => getCompanies({ page: 1, limit: 200 }),
  staleTime: 1000 * 60 * 10,
});

const jobs = computed(() => jobsQuery.data.value?.data ?? []);
const skillsOptions = computed(() => (skillsQuery.data.value ?? []).map((item) => item.skill));
const companyOptions = computed(() =>
  (companiesQuery.data.value?.data ?? []).map((company) => ({
    id: company.id,
    name: company.name,
  })),
);
</script>

<template>
  <section class="map-page-layout" data-testid="jobs-map-page">
    <aside class="map-sidebar">
      <MapFilters
        :filters="filters"
        :count="jobs.length"
        :skills-options="skillsOptions"
        :company-options="companyOptions"
        @update:filters="(value) => Object.assign(filters, value)"
      />
    </aside>
    <div class="map-container">
      <JobsMap :jobs="jobs" :filters="filters" />
      <div v-if="jobsQuery.isLoading.value" class="map-loading">
        {{ t("common.loading") }}
      </div>
    </div>
  </section>
</template>
