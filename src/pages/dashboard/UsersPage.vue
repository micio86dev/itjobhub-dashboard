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
import { buildUsersColumns } from "@/components/organisms/columns/users.columns";
import { getUsers } from "@/services/users.service";

const { t } = useI18n();

const filters = reactive({
  search: "",
  loginMethod: "",
  dateFrom: "",
  dateTo: "",
});

const usersQuery = useQuery({
  queryKey: ["users", filters],
  queryFn: () =>
    getUsers({
      page: 1,
      limit: 25,
      search: filters.search || undefined,
      loginMethod: filters.loginMethod || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    }),
  staleTime: 1000 * 60,
});

const columns = computed(() => buildUsersColumns(t));
</script>

<template>
  <section class="page-container" data-testid="users-page">
    <div class="page-header">
      <h2 class="page-title">{{ t("users.title") }}</h2>
    </div>

    <div class="filter-container">
      <div class="filter-grid filter-grid-4">
        <Input
          v-model="filters.search"
          :placeholder="t('common.search')"
          data-testid="users-filter-search"
        />
        <Select v-model="filters.loginMethod">
          <SelectTrigger data-testid="users-filter-method">
            <SelectValue :placeholder="t('users.filters.method')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{{ t("common.reset") }}</SelectItem>
            <SelectItem value="email">{{ t("users.methods.email") }}</SelectItem>
            <SelectItem value="google">{{ t("users.methods.google") }}</SelectItem>
            <SelectItem value="linkedin">{{ t("users.methods.linkedin") }}</SelectItem>
            <SelectItem value="github">{{ t("users.methods.github") }}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          v-model="filters.dateFrom"
          type="date"
          :placeholder="t('users.filters.dateFrom')"
          data-testid="users-filter-date-from"
        />
        <Input
          v-model="filters.dateTo"
          type="date"
          :placeholder="t('users.filters.dateTo')"
          data-testid="users-filter-date-to"
        />
      </div>
      <div class="filter-actions">
        <Button
          variant="ghost"
          size="sm"
          data-testid="users-filter-reset"
          @click="
            () => Object.assign(filters, { search: '', loginMethod: '', dateFrom: '', dateTo: '' })
          "
        >
          {{ t("common.reset") }}
        </Button>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="usersQuery.data.value?.data ?? []"
      :loading="usersQuery.isLoading.value"
      :total-rows="usersQuery.data.value?.total"
    />
  </section>
</template>
