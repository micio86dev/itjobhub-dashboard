<script setup lang="ts">
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/organisms/DataTable.vue";
import { buildJobsColumns } from "@/components/organisms/columns/jobs.columns";
import { getJobs } from "@/services/jobs.service";

const { t } = useI18n();

const filters = reactive({
  search: "",
  status: "",
  company: "",
});

const jobsQuery = useQuery({
  queryKey: ["jobs", filters],
  queryFn: () =>
    getJobs({
      page: 1,
      limit: 25,
      search: filters.search || undefined,
      status:
        (filters.status as "active" | "expired" | "draft" | "closed" | undefined) || undefined,
      company: filters.company || undefined,
    }),
  staleTime: 1000 * 60,
});

const columns = computed(() => buildJobsColumns(t));
</script>

<template>
  <section class="page-container" data-testid="jobs-page">
    <div class="page-header">
      <h2 class="page-title">{{ t("jobs.title") }}</h2>
    </div>

    <div class="filter-container">
      <div class="filter-grid filter-grid-3">
        <Input
          v-model="filters.search"
          :placeholder="t('common.search')"
          data-testid="jobs-filter-search"
        />
        <Select v-model="filters.status">
          <SelectTrigger data-testid="jobs-filter-status">
            <SelectValue :placeholder="t('jobs.filters.status')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{{ t("common.reset") }}</SelectItem>
            <SelectItem value="active">{{ t("jobs.status.active") }}</SelectItem>
            <SelectItem value="expired">{{ t("jobs.status.expired") }}</SelectItem>
            <SelectItem value="draft">{{ t("jobs.status.draft") }}</SelectItem>
            <SelectItem value="closed">{{ t("jobs.status.closed") }}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          v-model="filters.company"
          :placeholder="t('jobs.filters.company')"
          data-testid="jobs-filter-company"
        />
      </div>
      <div class="filter-actions">
        <Button
          variant="ghost"
          size="sm"
          data-testid="jobs-filter-reset"
          @click="() => Object.assign(filters, { search: '', status: '', company: '' })"
        >
          {{ t("common.reset") }}
        </Button>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="jobsQuery.data.value?.data ?? []"
      :loading="jobsQuery.isLoading.value"
      :total-rows="jobsQuery.data.value?.total"
      exportable
    />
  </section>
</template>
