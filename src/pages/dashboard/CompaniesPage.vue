<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { ExternalLink, Star } from 'lucide-vue-next'
import { companiesService } from '@/services/companies.service'
import type { Company } from '@/api'

useI18n()
const search = shallowRef('')
const selectedCompany = shallowRef<Company | null>(null)
const dialogOpen = shallowRef(false)

const companiesQ = useQuery({
  queryKey: ['companies'],
  queryFn: () => companiesService.getCompanies({ limit: 100 }),
})

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return (companiesQ.data.value?.items ?? []).filter((c) =>
    !q || c.name.toLowerCase().includes(q),
  )
})

function openDialog(company: Company) {
  selectedCompany.value = company
  dialogOpen.value = true
}
</script>

<template>
  <div class="page-stack">

    <div class="page-header-row">
      <div class="page-title-group">
        <h1 class="page-title">{{ $t('companies.title') }}</h1>
        <span v-if="companiesQ.data.value" class="badge">{{ companiesQ.data.value.total }}</span>
      </div>
      <input v-model="search" type="text" :placeholder="$t('common.search')" class="form-search" />
    </div>

    <!-- Loading skeleton grid -->
    <div v-if="companiesQ.isPending.value" class="companies-grid">
      <div v-for="i in 9" :key="i" class="skeleton company-skeleton" />
    </div>

    <!-- Companies grid -->
    <div v-else class="companies-grid">
      <div
        v-for="company in filtered"
        :key="company.id"
        class="card-interactive"
        @click="openDialog(company)"
      >
        <div class="company-card-header">
          <div class="company-card-info">
            <img v-if="company.logo" :src="company.logo" :alt="company.name" class="company-logo" />
            <div v-else class="company-logo-fallback">{{ company.name.slice(0, 2).toUpperCase() }}</div>
            <div>
              <p class="company-name">{{ company.name }}</p>
              <a v-if="company.website" :href="company.website" target="_blank" class="company-link" @click.stop>
                <ExternalLink class="h-3 w-3" />
                {{ $t('companies.website') }}
              </a>
            </div>
          </div>
        </div>

        <div class="company-meta">
          <div v-if="company.trustScore" class="company-rating">
            <Star class="h-3.5 w-3.5 rating-star" />
            {{ company.trustScore.toFixed(1) }}
          </div>
          <span v-if="company.created_at">
            {{ $t('companies.createdAt') }}: {{ company.created_at?.slice(0, 10) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Detail dialog -->
    <div v-if="dialogOpen && selectedCompany" class="overlay" @click.self="dialogOpen = false">
      <div class="dialog-md">
        <div class="dialog-header">
          <div class="dialog-header-info">
            <img v-if="selectedCompany.logo" :src="selectedCompany.logo" :alt="selectedCompany.name" class="dialog-logo" />
            <h2 class="dialog-company-title">{{ selectedCompany.name }}</h2>
          </div>
          <button class="btn-icon" @click="dialogOpen = false">✕</button>
        </div>
        <p v-if="selectedCompany.description" class="dialog-description">{{ selectedCompany.description }}</p>
        <dl class="dialog-details">
          <div>
            <dt class="detail-label">{{ $t('companies.trustScore') }}</dt>
            <dd class="detail-value">{{ selectedCompany.trustScore ?? '-' }}</dd>
          </div>
          <div>
            <dt class="detail-label">{{ $t('companies.ratings') }}</dt>
            <dd class="detail-value">{{ selectedCompany.totalRatings ?? 0 }}</dd>
          </div>
        </dl>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.companies-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .companies-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1280px) {
  .companies-grid { grid-template-columns: repeat(3, 1fr); }
}

.company-skeleton {
  height: 10rem;
  border-radius: var(--r-card);
}

.company-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.company-card-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.company-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--text-xs);
  color: var(--c-text-muted);
}

.company-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-star { color: var(--color-amber-400); }

/* ── Dialog ── */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.dialog-header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dialog-logo {
  width: 3rem;
  height: 3rem;
  border-radius: var(--r-sm);
  object-fit: contain;
}

.dialog-company-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--c-text-base);
}

.dialog-description {
  margin-bottom: 1rem;
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
}

.dialog-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  font-size: var(--text-sm);
}

.detail-label {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--c-text-subtle);
}

.detail-value {
  color: var(--c-text-secondary);
  margin: 0;
}
</style>
