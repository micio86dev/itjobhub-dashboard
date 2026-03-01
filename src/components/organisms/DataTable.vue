<script setup lang="ts" generic="T extends object">
import { shallowRef, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Download } from 'lucide-vue-next'
import { FlexRender } from '@tanstack/vue-table'

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<T>[]
    data: T[]
    loading?: boolean
    totalRows?: number
    pageSize?: number
    searchable?: boolean
    exportable?: boolean
  }>(),
  { loading: false, pageSize: 25, searchable: true, exportable: false },
)

const emit = defineEmits<{
  'row-click': [row: T]
}>()

const { t } = useI18n()

const globalFilter = shallowRef('')
const sorting = shallowRef<SortingState>([])
const rowSelection = shallowRef<Record<string, boolean>>({})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: {
    get sorting() { return sorting.value },
    get globalFilter() { return globalFilter.value },
    get rowSelection() { return rowSelection.value },
    get pagination() { return { pageIndex: 0, pageSize: props.pageSize } },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (val: string) => {
    globalFilter.value = val
  },
  enableRowSelection: true,
  onRowSelectionChange: (updater) => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
  },
})

const selectedCount = computed(() => Object.keys(rowSelection.value).length)

function exportCsv() {
  const rows = table.getFilteredRowModel().rows
  const headers = props.columns
    .map((col) => (typeof col.header === 'string' ? col.header : String(col.id ?? '')))
    .join(',')

  const lines = rows.map((row) =>
    row.getAllCells().map((cell) => {
      const val = cell.getValue()
      const str = val === null || val === undefined ? '' : String(val)
      return `"${str.replace(/"/g, '""')}"`
    }).join(','),
  )

  const csv = [headers, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// Reset page when data or filter changes
watch(() => props.data, () => { table.setPageIndex(0) })
watch(globalFilter, () => { table.setPageIndex(0) })
</script>

<template>
  <div data-testid="data-table" class="dt">

    <!-- Toolbar -->
    <div class="dt-toolbar">
      <input
        v-if="searchable"
        v-model="globalFilter"
        data-testid="search-input"
        type="text"
        :placeholder="t('table.search')"
        class="dt-search"
      />
      <slot name="toolbar-actions" />
      <button
        v-if="exportable"
        data-testid="export-csv"
        class="dt-export-btn"
        @click="exportCsv"
      >
        <Download class="h-4 w-4" />
        {{ $t('common.export') }}
      </button>
      <span v-if="selectedCount > 0" class="dt-selection-count">
        {{ t('table.selected', { n: selectedCount }) }}
      </span>
    </div>

    <!-- Table -->
    <div class="dt-table-wrap">
      <table class="dt-table">
        <thead>
          <tr class="dt-head-row">
            <th
              v-for="header in table.getFlatHeaders()"
              :key="header.id"
              class="dt-th"
              :class="{ 'is-sortable': header.column.getCanSort() }"
              :data-testid="`sort-${header.id}`"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="dt-th-inner">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <ChevronUp v-if="header.column.getIsSorted() === 'asc'" class="h-3 w-3" />
                <ChevronDown v-if="header.column.getIsSorted() === 'desc'" class="h-3 w-3" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Skeleton rows -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="dt-skeleton-row">
              <td v-for="col in columns" :key="String(col.id)" class="dt-td">
                <div class="dt-skeleton-cell" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="table.getRowModel().rows.length === 0">
            <td :colspan="columns.length">
              <div data-testid="empty-state" class="dt-empty">
                <p>{{ $t('table.emptyState') }}</p>
              </div>
            </td>
          </tr>

          <!-- Data rows -->
          <template v-else>
            <tr
              v-for="(row, idx) in table.getRowModel().rows"
              :key="row.id"
              :data-testid="`row-${idx}`"
              class="dt-row"
              @click="emit('row-click', row.original)"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="dt-td"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </td>
              <td v-if="$slots['row-actions']" class="dt-td">
                <slot name="row-actions" :row="row.original" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="dt-pagination">
      <span class="dt-pagination-total">
        {{ table.getFilteredRowModel().rows.length.toLocaleString() }} {{ $t('common.total') }}
      </span>

      <div class="dt-pagination-controls">
        <button
          class="dt-pagination-btn"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <ChevronsLeft class="h-4 w-4" />
        </button>
        <button
          data-testid="page-prev"
          class="dt-pagination-btn"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>

        <span class="dt-pagination-page">
          {{ table.getState().pagination.pageIndex + 1 }} / {{ table.getPageCount() || 1 }}
        </span>

        <button
          data-testid="page-next"
          class="dt-pagination-btn"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
        <button
          class="dt-pagination-btn"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <ChevronsRight class="h-4 w-4" />
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.dt-row {
  cursor: pointer;
}

.dt-th-inner {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
