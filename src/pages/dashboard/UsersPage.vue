<script setup lang="ts">
import { shallowRef, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import DataTable from '@/components/organisms/DataTable.vue'
import { usersService } from '@/services/users.service'
import type { ColumnDef } from '@tanstack/vue-table'
import type { UserListItem } from '@/api'
import { formatDistanceToNow } from 'date-fns'

const { t } = useI18n()

const search = shallowRef('')
const debouncedSearch = shallowRef('')
let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { debouncedSearch.value = val }, 300)
})

const queryParams = computed(() => ({ search: debouncedSearch.value || undefined }))

const usersQ = useQuery({
  queryKey: ['users', queryParams],
  queryFn: () => usersService.getUsers(queryParams.value),
})

const columns: ColumnDef<UserListItem>[] = [
  { id: 'name', accessorFn: (r) => `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || '-', header: t('users.name') },
  { id: 'email', accessorKey: 'email', header: t('users.email') },
  { id: 'role', accessorKey: 'role', header: t('users.role') },
  {
    id: 'createdAt',
    accessorFn: (r) => {
      if (!r.createdAt) return '-'
      try { return formatDistanceToNow(new Date(String(r.createdAt)), { addSuffix: true }) } catch { return '-' }
    },
    header: t('users.registeredAt'),
  },
  { id: 'profileCompleted', accessorFn: (r) => r.profileCompleted ? '✓' : '–', header: t('nav.profile') },
]
</script>

<template>
  <div class="page-stack">

    <div class="page-header-row">
      <div class="page-title-group">
        <h1 class="page-title">{{ $t('users.title') }}</h1>
        <span v-if="usersQ.data.value" class="badge">{{ usersQ.data.value.total }}</span>
      </div>
    </div>

    <div>
      <input v-model="search" type="text" :placeholder="$t('common.search')" class="form-search" />
    </div>

    <DataTable
      :columns="columns"
      :data="usersQ.data.value?.items ?? []"
      :loading="usersQ.isPending.value"
      :searchable="false"
    />

  </div>
</template>
