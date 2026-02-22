<template>
  <div class="flex flex-col h-[calc(100vh-10rem)]">
    <div class="flex justify-between items-end mb-6">
      <div>
        <h2 class="font-bold text-3xl tracking-tight">{{ t('jobsMap.title') }}</h2>
        <p class="text-muted-foreground">{{ t('jobsMap.subtitle') }}</p>
      </div>
    </div>

    <Alert v-if="isError" variant="destructive" class="mb-6">
      <AlertTitle>{{ t('overview.error') }}</AlertTitle>
      <AlertDescription class="flex justify-between items-center">
        <span>{{ t('overview.error') }}</span>
        <Button variant="outline" size="sm" @click="() => refetch()">{{ t('overview.retry') }}</Button>
      </AlertDescription>
    </Alert>

    <div class="flex lg:flex-row flex-col flex-1 gap-6 min-h-0">
      <div class="flex flex-col w-full lg:w-80 h-full min-h-0 overflow-y-auto shrink-0">
        <MapFilters :result-count="jobsData?.total || 0" @update:filters="handleFilterUpdate" />
      </div>

      <div class="flex-1 bg-muted/20 border rounded-xl min-h-[500px] lg:min-h-0 overflow-hidden">
        <JobsMap :jobs="(jobsData?.data as any) || []" :filters="filters" :loading="isLoading" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'

import { jobsService } from '@/services/jobs.service'

import JobsMap from '@/components/organisms/JobsMap.vue'
import MapFilters from '@/components/organisms/MapFilters.vue'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const { t } = useI18n()

const filters = ref<Record<string, unknown>>({})

const { data: jobsData, isLoading, isError, refetch } = useQuery({
  queryKey: ['jobsMap', filters],
  queryFn: () => jobsService.getJobs(filters.value),
  staleTime: 5 * 60 * 1000
})

const handleFilterUpdate = (newFilters: Record<string, unknown>) => {
  filters.value = { ...newFilters }
}
</script>
