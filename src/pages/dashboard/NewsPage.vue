<script setup lang="ts">
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import type { ColumnDef } from "@tanstack/vue-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/organisms/DataTable.vue";
import { getNews } from "@/services/news.service";
import type { News } from "@/types/api";

const { t } = useI18n();

const filters = reactive({
  search: "",
  category: "",
});

const newsQuery = useQuery({
  queryKey: ["news", filters],
  queryFn: () =>
    getNews({
      page: 1,
      limit: 25,
      search: filters.search || undefined,
      category: filters.category || undefined,
    }),
  staleTime: 1000 * 60,
});

const columns = computed<ColumnDef<News>[]>(() => [
  { accessorKey: "title", header: () => t("news.table.title") },
  { accessorKey: "category", header: () => t("news.table.category") },
  {
    id: "author",
    header: () => t("news.table.author"),
    cell: () => t("common.placeholder"),
  },
  { accessorKey: "published_at", header: () => t("news.table.published") },
  { accessorKey: "views_count", header: () => t("news.table.views") },
  {
    id: "status",
    header: () => t("news.table.status"),
    cell: ({ row }) => (row.original.is_published ? t("common.status") : t("common.placeholder")),
  },
]);
</script>

<template>
  <section class="page-container" data-testid="news-page">
    <div class="page-header">
      <h2 class="page-title">{{ t("news.title") }}</h2>
    </div>

    <div class="filter-container">
      <div class="filter-grid filter-grid-3">
        <Input
          v-model="filters.search"
          :placeholder="t('common.search')"
          data-testid="news-filter-search"
        />
        <Select v-model="filters.category">
          <SelectTrigger data-testid="news-filter-category">
            <SelectValue :placeholder="t('news.filters.category')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{{ t("common.reset") }}</SelectItem>
            <SelectItem value="AI">{{ t("news.categories.ai") }}</SelectItem>
            <SelectItem value="IT">{{ t("news.categories.it") }}</SelectItem>
            <SelectItem value="Security">{{ t("news.categories.security") }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="newsQuery.data.value?.data ?? []"
      :loading="newsQuery.isLoading.value"
      :total-rows="newsQuery.data.value?.total"
    />
  </section>
</template>
