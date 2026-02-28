<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Info } from 'lucide-vue-next'
import BarChart from '@/components/organisms/charts/BarChart.vue'
import DataTable from '@/components/organisms/DataTable.vue'
import { analyticsService } from '@/services/analytics.service'
import type { ColumnDef } from '@tanstack/vue-table'
import type { SkillStat } from '@/services/analytics.service'

const { t } = useI18n()

const skillsQ = useQuery({
  queryKey: ['skills-stats'],
  queryFn: () => analyticsService.getTopSkills(30),
})

const top30Chart = computed(() =>
  (skillsQ.data.value ?? []).map((s) => ({ label: s.skill, value: s.count })),
)

const tableColumns: ColumnDef<SkillStat>[] = [
  { id: 'skill', accessorKey: 'skill', header: t('skills.skillsTable') },
  { id: 'count', accessorKey: 'count', header: t('skills.jobCount') },
]
</script>

<template>
  <div class="page-stack">

    <h1 class="page-title">{{ $t('skills.title') }}</h1>

    <!-- Top 30 skills -->
    <div class="grid-2col">
      <BarChart :title="$t('skills.topJobSkills')" :data="top30Chart" :horizontal="true"
        :loading="skillsQ.isPending.value" />

      <div class="card-placeholder">
        <div class="placeholder-inner">
          <Info class="placeholder-icon h-6 w-6" />
          <p class="placeholder-label">{{ $t('skills.topSearchedSkills') }}</p>
          <p class="placeholder-hint">{{ $t('skills.noSearchData') }}</p>
        </div>
      </div>
    </div>

    <!-- Skills table -->
    <div>
      <h2 class="section-heading">{{ $t('skills.skillsTable') }}</h2>
      <DataTable :columns="tableColumns" :data="skillsQ.data.value ?? []" :loading="skillsQ.isPending.value"
        :exportable="true" :page-size="30" />
    </div>

  </div>
</template>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.placeholder-inner {
  text-align: center;
}

.placeholder-icon {
  display: block;
  margin: 0 auto var(--sp-2);
  color: var(--c-text-subtle);
}
</style>
