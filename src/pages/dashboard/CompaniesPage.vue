<script setup lang="ts">
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getCompanies } from "@/services/companies.service";

const { t } = useI18n();

const filters = reactive({
  search: "",
  industry: "",
  verified: false,
});

const companiesQuery = useQuery({
  queryKey: ["companies", filters],
  queryFn: () =>
    getCompanies({
      page: 1,
      limit: 20,
      search: filters.search || undefined,
      industry: filters.industry || undefined,
      verified: filters.verified || undefined,
    }),
  staleTime: 1000 * 60,
});

const companies = computed(() => companiesQuery.data.value?.data ?? []);
</script>

<template>
  <section class="page-container" data-testid="companies-page">
    <div class="page-header">
      <h2 class="page-title">{{ t("companies.title") }}</h2>
    </div>

    <div class="filter-container">
      <div class="filter-grid filter-grid-3">
        <Input
          v-model="filters.search"
          :placeholder="t('common.search')"
          data-testid="companies-filter-search"
        />
        <Input
          v-model="filters.industry"
          :placeholder="t('companies.filters.industry')"
          data-testid="companies-filter-industry"
        />
        <label class="filter-checkbox-label">
          <Checkbox v-model:checked="filters.verified" data-testid="companies-filter-verified" />
          <span>{{ t("companies.filters.verified") }}</span>
        </label>
      </div>
      <div class="filter-actions">
        <Button
          variant="ghost"
          size="sm"
          data-testid="companies-filter-reset"
          @click="() => Object.assign(filters, { search: '', industry: '', verified: false })"
        >
          {{ t("common.reset") }}
        </Button>
      </div>
    </div>

    <div class="cards-grid">
      <Card v-for="company in companies" :key="company.id">
        <CardHeader>
          <CardTitle class="card-title-sm">{{ company.name }}</CardTitle>
        </CardHeader>
        <CardContent class="stack-sm">
          <div class="company-card-industry">
            {{ company.industry ?? t("common.placeholder") }}
          </div>
          <div class="company-card-badges">
            <Badge variant="secondary">
              {{ t("companies.card.jobs") }}: {{ company.jobs?.length ?? 0 }}
            </Badge>
            <Badge v-if="company.trustScore >= 80" variant="secondary">
              {{ t("companies.card.verified") }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
