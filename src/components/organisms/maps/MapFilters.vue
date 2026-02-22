<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MapFiltersState = {
  skills: string[];
  remote: "remote" | "hybrid" | "onsite" | null;
  company: string | null;
  contractType: string | null;
  experienceLevel: string | null;
  publishedWithin: 7 | 30 | 90 | null;
};

interface Props {
  filters: MapFiltersState;
  count?: number;
  skillsOptions?: string[];
  companyOptions?: Array<{ id: string; name: string }>;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (event: "update:filters", value: MapFiltersState): void }>();
const { t } = useI18n();

const state = reactive<MapFiltersState>({ ...props.filters });
const skillSearch = ref("");
const companySearch = ref("");
const filteredSkills = computed(() => {
  const options = props.skillsOptions ?? [];
  if (!skillSearch.value) return options.slice(0, 8);
  return options
    .filter((skill) => skill.toLowerCase().includes(skillSearch.value.toLowerCase()))
    .slice(0, 8);
});

const filteredCompanies = computed(() => {
  const options = props.companyOptions ?? [];
  if (!companySearch.value) return options.slice(0, 8);
  return options
    .filter((company) => company.name.toLowerCase().includes(companySearch.value.toLowerCase()))
    .slice(0, 8);
});

const contractOptions = [
  { value: "PERMANENT", label: t("map.filters.contractOptions.permanent") },
  { value: "TEMPORARY", label: t("map.filters.contractOptions.temporary") },
  { value: "PROJECT", label: t("map.filters.contractOptions.project") },
  { value: "FREELANCE", label: t("map.filters.contractOptions.freelance") },
];

const levelOptions = [
  { value: "JUNIOR", label: t("map.filters.levelOptions.junior") },
  { value: "MIDDLE", label: t("map.filters.levelOptions.middle") },
  { value: "SENIOR", label: t("map.filters.levelOptions.senior") },
  { value: "LEAD", label: t("map.filters.levelOptions.lead") },
];

watch(
  () => props.filters,
  (value) => {
    Object.assign(state, value);
  },
  { deep: true },
);

watch(
  () => ({ ...state }),
  (value) => {
    emit("update:filters", { ...value });
  },
  { deep: true },
);

function resetFilters() {
  state.skills = [];
  state.remote = null;
  state.company = null;
  state.contractType = null;
  state.experienceLevel = null;
  state.publishedWithin = null;
}

function toggleSkill(skill: string) {
  if (state.skills.includes(skill)) {
    state.skills = state.skills.filter((item) => item !== skill);
  } else {
    state.skills = [...state.skills, skill];
  }
}
</script>

<template>
  <div class="map-filters-panel">
    <div class="map-filters-header">
      <h2 class="map-filters-title">{{ t("map.filters.title") }}</h2>
      <Button variant="ghost" size="sm" @click="resetFilters">
        {{ t("map.filters.reset") }}
      </Button>
    </div>

    <div class="map-filters-section">
      <label class="map-filters-label">{{ t("map.filters.skills") }}</label>
      <Input v-model="skillSearch" :placeholder="t('map.filters.skillsSearch')" />
      <div class="map-filters-options-box">
        <div v-if="filteredSkills.length === 0" class="map-filters-label">
          {{ t("map.filters.skillsEmpty") }}
        </div>
        <label v-for="skill in filteredSkills" :key="skill" class="map-filters-checkbox-label">
          <Checkbox
            :checked="state.skills.includes(skill)"
            @update:checked="() => toggleSkill(skill)"
          />
          <span>{{ skill }}</span>
        </label>
      </div>
    </div>

    <div class="map-filters-section">
      <label class="map-filters-label">{{ t("map.filters.company") }}</label>
      <Input v-model="companySearch" :placeholder="t('map.filters.companySearch')" />
      <div class="map-filters-options-box map-filters-options-box-sm">
        <Button
          v-for="company in filteredCompanies"
          :key="company.id"
          variant="ghost"
          size="sm"
          class="w-full justify-start"
          @click="state.company = company.id"
        >
          {{ company.name }}
        </Button>
      </div>
    </div>

    <div class="map-filters-section">
      <label class="map-filters-label">{{ t("map.filters.remote") }}</label>
      <div class="map-filters-btn-group">
        <Button
          size="sm"
          :variant="state.remote === null ? 'default' : 'outline'"
          @click="state.remote = null"
        >
          {{ t("map.filters.all") }}
        </Button>
        <Button
          size="sm"
          :variant="state.remote === 'remote' ? 'default' : 'outline'"
          @click="state.remote = 'remote'"
        >
          {{ t("map.filters.remoteOnly") }}
        </Button>
        <Button
          size="sm"
          :variant="state.remote === 'hybrid' ? 'default' : 'outline'"
          @click="state.remote = 'hybrid'"
        >
          {{ t("map.filters.hybrid") }}
        </Button>
        <Button
          size="sm"
          :variant="state.remote === 'onsite' ? 'default' : 'outline'"
          @click="state.remote = 'onsite'"
        >
          {{ t("map.filters.onsite") }}
        </Button>
      </div>
    </div>

    <div class="map-filters-section">
      <label class="map-filters-label">{{ t("map.filters.contract") }}</label>
      <Select v-model="state.contractType">
        <SelectTrigger>
          <SelectValue :placeholder="t('map.filters.contractPlaceholder')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="null">{{ t("map.filters.all") }}</SelectItem>
          <SelectItem v-for="option in contractOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="map-filters-section">
      <label class="map-filters-label">{{ t("map.filters.level") }}</label>
      <Select v-model="state.experienceLevel">
        <SelectTrigger>
          <SelectValue :placeholder="t('map.filters.levelPlaceholder')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="null">{{ t("map.filters.all") }}</SelectItem>
          <SelectItem v-for="option in levelOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="map-filters-section">
      <label class="map-filters-label">{{ t("map.filters.published") }}</label>
      <Select v-model="state.publishedWithin">
        <SelectTrigger>
          <SelectValue :placeholder="t('map.filters.all')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="null">{{ t("map.filters.all") }}</SelectItem>
          <SelectItem :value="7">{{ t("map.filters.days7") }}</SelectItem>
          <SelectItem :value="30">{{ t("map.filters.days30") }}</SelectItem>
          <SelectItem :value="90">{{ t("map.filters.days90") }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-if="count !== undefined" class="map-filters-count">
      {{ t("map.filters.count", { count }) }}
    </div>
  </div>
</template>
