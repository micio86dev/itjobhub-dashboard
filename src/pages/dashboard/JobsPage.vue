<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ExternalLink, Trash2 } from 'lucide-vue-next'
import DataTable from '@/components/organisms/DataTable.vue'
import ConfirmDialog from '@/components/organisms/ConfirmDialog.vue'
import { jobsService } from '@/services/jobs.service'
import { jobsApi } from '@/api'
import type { ColumnDef } from '@tanstack/vue-table'
import type { JobListItem } from '@/api'

const { t } = useI18n()
const qc = useQueryClient()

const statusFilter = shallowRef('')
const workModeFilter = shallowRef('')
const confirmDeleteId = shallowRef<string | null>(null)

const queryParams = computed(() => ({
  limit: 50,
  status: statusFilter.value || undefined,
  workMode: workModeFilter.value || undefined,
}))

const jobsQ = useQuery({
  queryKey: ['jobs-page', queryParams],
  queryFn: () => jobsService.getJobs(queryParams.value),
})

const columns: ColumnDef<JobListItem>[] = [
  { id: 'title', accessorKey: 'title', header: t('jobs.jobTitle'), cell: ({ row }) => row.original.title },
  { id: 'company', accessorFn: (r) => r.company?.name ?? '-', header: t('jobs.company') },
  { id: 'skills', accessorFn: (r) => r.skills.slice(0, 3).join(', ') + (r.skills.length > 3 ? ` +${r.skills.length - 3}` : ''), header: t('jobs.skills') },
  { id: 'workMode', accessorKey: 'workMode', header: t('jobs.type') },
  { id: 'contractType', accessorKey: 'contractType', header: t('jobs.contract') },
  { id: 'seniority', accessorKey: 'seniority', header: t('jobs.level') },
  { id: 'created_at', accessorFn: (r) => r.created_at?.slice(0, 10) ?? '-', header: t('jobs.publishedAt') },
  { id: 'status', accessorKey: 'status', header: t('jobs.status') },
]

async function confirmDelete() {
  if (!confirmDeleteId.value) return
  await jobsApi.deleteJob(confirmDeleteId.value)
  confirmDeleteId.value = null
  qc.invalidateQueries({ queryKey: ['jobs-page'] })
}
</script>

<template>
  <div class="page-stack">

    <div class="page-header-row">
      <div class="page-title-group">
        <h1 class="page-title">{{ $t('jobs.title') }}</h1>
        <span v-if="jobsQ.data.value" class="badge">{{ jobsQ.data.value.total }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <select v-model="statusFilter" class="form-select filter-select">
        <option value="">{{ $t('jobs.allStatus') }}</option>
        <option value="active">{{ $t('jobs.statusOptions.active') }}</option>
        <option value="closed">{{ $t('jobs.statusOptions.closed') }}</option>
        <option value="draft">{{ $t('jobs.statusOptions.draft') }}</option>
      </select>
      <select v-model="workModeFilter" class="form-select filter-select">
        <option value="">{{ $t('common.all') }}</option>
        <option value="remote">{{ $t('jobs.workMode.remote') }}</option>
        <option value="hybrid">{{ $t('jobs.workMode.hybrid') }}</option>
        <option value="onsite">{{ $t('jobs.workMode.onsite') }}</option>
      </select>
    </div>

    <DataTable :columns="columns" :data="jobsQ.data.value?.items ?? []" :loading="jobsQ.isPending.value"
      :exportable="true">
      <template #row-actions="{ row }">
        <div class="row-actions">
          <a v-if="(row as JobListItem).source_url" :href="(row as JobListItem).source_url ?? ''" target="_blank"
            class="btn-row-action is-primary">
            <ExternalLink class="h-4 w-4" />
          </a>
          <button class="btn-row-action is-danger" @click="confirmDeleteId = (row as JobListItem).id">
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog v-model:isOpen="confirmDeleteId" :title="$t('jobs.removeJob')" :message="$t('jobs.confirmRemove')"
      @confirm="confirmDelete" />

  </div>
</template>

<style scoped>
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-select {
  width: auto;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
