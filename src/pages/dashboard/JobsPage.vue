<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
       <h2 class="font-bold text-3xl tracking-tight">{{ t('jobsList.title') }}</h2>
    </div>

    <!-- Filters -->
    <div class="flex sm:flex-row flex-col gap-4">
      <div class="relative w-full sm:max-w-xs">
        <Search class="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
        <Input
          v-model="filters.search"
          :placeholder="t('jobsList.searchPlaceholder')"
          class="pl-9"
          @input="handleSearch"
        />
      </div>
      <Select v-model="filters.type" @update:model-value="() => refetch()">
        <SelectTrigger class="w-[180px]">
          <SelectValue :placeholder="t('jobsList.filters.allTypes')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{{ t('jobsList.filters.allTypes') }}</SelectItem>
          <SelectItem value="full-time">{{ t('jobsList.filters.fullTime') }}</SelectItem>
          <SelectItem value="part-time">{{ t('jobsList.filters.partTime') }}</SelectItem>
          <SelectItem value="contract">{{ t('jobsList.filters.contract') }}</SelectItem>
          <SelectItem value="freelance">{{ t('jobsList.filters.freelance') }}</SelectItem>
        </SelectContent>
      </Select>
      <Select v-model="filters.status" @update:model-value="() => refetch()">
        <SelectTrigger class="w-[180px]">
          <SelectValue :placeholder="t('jobsList.filters.allStatuses')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{{ t('jobsList.filters.allStatuses') }}</SelectItem>
          <SelectItem value="active">{{ t('jobsList.filters.active') }}</SelectItem>
          <SelectItem value="draft">{{ t('jobsList.filters.draft') }}</SelectItem>
          <SelectItem value="closed">{{ t('jobsList.filters.closed') }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Alert v-if="isError" variant="destructive">
      <AlertTitle>{{ t('overview.error') }}</AlertTitle>
      <AlertDescription class="flex justify-between items-center">
        <span>Impossibile caricare le offerte di lavoro.</span>
        <Button variant="outline" size="sm" @click="() => refetch()">{{ t('overview.retry') }}</Button>
      </AlertDescription>
    </Alert>

    <!-- Table -->
    <DataTable
      :columns="columns"
      :data="(jobsData?.data as any) || []"
      :loading="isLoading"
      :total-rows="jobsData?.total"
      :page-size="10"
    >
      <template #row-actions>
        <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" class="h-8">
              {{ t('jobsList.actions.edit') }}
            </Button>
            <Button variant="secondary" size="sm" class="h-8">
              {{ t('jobsList.actions.viewApplications') }}
            </Button>
            <Button variant="ghost" size="sm" class="hover:bg-destructive/10 h-8 text-destructive hover:text-destructive">
              {{ t('jobsList.actions.closeJob') }}
            </Button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Search } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'

import { getJobsColumns } from '@/components/organisms/columns/jobs.columns'
import { jobsService } from '@/services/jobs.service'
import type { ColumnDef } from '@tanstack/vue-table'

import DataTable from '@/components/organisms/DataTable.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { t } = useI18n()

const filters = ref({
  search: '',
  type: 'all',
  status: 'all'
})

// Columns
const columns = computed(() => getJobsColumns(t) as unknown as ColumnDef<Record<string, unknown>, unknown>[])

// Query
const { data: jobsData, isLoading, isError, refetch } = useQuery({
  queryKey: ['jobs', filters],
  queryFn: () => jobsService.getJobs({
    search: filters.value.search,
    type: filters.value.type !== 'all' ? filters.value.type : undefined,
    status: filters.value.status !== 'all' ? filters.value.status : undefined,
  }),
  staleTime: 5 * 60 * 1000
})

const handleSearch = useDebounceFn(() => {
  refetch()
}, 300)
</script>
