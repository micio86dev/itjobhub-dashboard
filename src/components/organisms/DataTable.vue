<template>
  <div class="space-y-4 w-full" data-testid="data-table">
    <!-- Toolbar -->
    <div class="flex flex-wrap justify-between items-center gap-4">
      <div class="flex flex-1 items-center gap-2 min-w-[200px]">
        <div v-if="searchable" class="relative w-full max-w-sm">
          <Search class="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
          <Input 
            v-model="globalFilter" 
            placeholder="Cerca..." 
            class="pl-9"
            data-testid="search-input"
          />
        </div>
        <slot name="toolbar-actions" />
      </div>

      <div class="flex items-center gap-2">
        <!-- Selected count -->
        <div v-if="selectedCount > 0" class="mr-2 text-muted-foreground text-sm">
          {{ selectedCount }} selezionat{{ selectedCount === 1 ? 'o' : 'i' }}
        </div>
        <!-- Export CSV -->
        <Button 
          v-if="exportable" 
          variant="outline" 
          size="sm" 
          @click="exportCSV"
          data-testid="export-csv"
        >
          <Download class="mr-2 w-4 h-4" />
          Esporta CSV
        </Button>
      </div>
    </div>

    <!-- Table -->
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow 
            v-for="headerGroup in table.getHeaderGroups()" 
            :key="headerGroup.id"
          >
            <TableHead 
              v-for="header in headerGroup.headers" 
              :key="header.id"
              :class="{ 'cursor-pointer select-none': header.column.getCanSort() }"
              @click="header.column.getToggleSortingHandler()?.($event)"
              :data-testid="header.column.getCanSort() ? `sort-${header.column.id}` : undefined"
            >
              <div class="flex items-center gap-1">
                <FlexRender 
                  v-if="!header.isPlaceholder" 
                  :render="header.column.columnDef.header" 
                  :props="header.getContext()" 
                />
                <template v-if="header.column.getCanSort()">
                  <ArrowDown v-if="header.column.getIsSorted() === 'desc'" class="w-4 h-4" />
                  <ArrowUp v-else-if="header.column.getIsSorted() === 'asc'" class="w-4 h-4" />
                  <ArrowUpDown v-else class="w-4 h-4 text-muted-foreground" />
                </template>
              </div>
            </TableHead>
            <TableHead v-if="$slots['row-actions']" class="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="loading">
            <TableRow v-for="i in 5" :key="i" class="animate-pulse">
              <TableCell v-for="(col, index) in columns" :key="col.id || index">
                <Skeleton class="rounded w-full h-5" />
              </TableCell>
              <TableCell v-if="$slots['row-actions']">
                <Skeleton class="rounded w-8 h-8" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="table.getRowModel().rows?.length">
            <TableRow 
              v-for="(row, index) in table.getRowModel().rows" 
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
              :data-testid="`row-${index}`"
            >
              <TableCell 
                v-for="cell in row.getVisibleCells()" 
                :key="cell.id"
              >
                <FlexRender 
                  :render="cell.column.columnDef.cell" 
                  :props="cell.getContext()" 
                />
              </TableCell>
              <!-- Row Actions Slot -->
              <TableCell v-if="$slots['row-actions']" class="text-right">
                <slot name="row-actions" :row="row.original" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow>
              <TableCell 
                :colspan="columns.length + ($slots['row-actions'] ? 1 : 0)" 
                class="h-48 text-center"
                data-testid="empty-state"
              >
                <div class="flex flex-col justify-center items-center text-muted-foreground">
                  <Inbox class="opacity-20 mb-2 w-10 h-10" />
                  <p>Nessun risultato</p>
                </div>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center" v-if="totalRows !== undefined || table.getPageCount() > 1">
      <div class="text-muted-foreground text-sm">
        {{ paginationText }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          @click="table.setPageIndex(0)"
          :disabled="!table.getCanPreviousPage()"
        >
          <ChevronsLeft class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
          data-testid="page-prev"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="table.nextPage()"
          :disabled="!table.getCanNextPage()"
          data-testid="page-next"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="table.setPageIndex(table.getPageCount() - 1)"
          :disabled="!table.getCanNextPage()"
        >
          <ChevronsRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ref, computed } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender
} from '@tanstack/vue-table'
import type { 
  ColumnDef, 
  SortingState
} from '@tanstack/vue-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import {
  Search,
  Download,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  columns: ColumnDef<T, unknown>[]
  data: T[]
  loading?: boolean
  totalRows?: number
  pageSize?: number
  searchable?: boolean
  exportable?: boolean
}>(), {
  loading: false,
  pageSize: 25,
  searchable: false,
  exportable: false,
})

const sorting = ref<SortingState>([])
const globalFilter = ref('')
const rowSelection = ref({})

// Costruiamo la tabella
const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get globalFilter() { return globalFilter.value },
    get rowSelection() { return rowSelection.value },
  },
  onSortingChange: updaterOrValue => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  onGlobalFilterChange: updaterOrValue => {
    globalFilter.value = typeof updaterOrValue === 'function' ? updaterOrValue(globalFilter.value) : updaterOrValue
  },
  onRowSelectionChange: updaterOrValue => {
    rowSelection.value = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  initialState: {
    pagination: {
      pageSize: props.pageSize
    }
  }
})

const selectedCount = computed(() => Object.keys(rowSelection.value).length)

const paginationText = computed(() => {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  
  if (props.totalRows !== undefined) {
    const start = pageIndex * pageSize + 1
    const end = Math.min((pageIndex + 1) * pageSize, props.totalRows)
    return `${start}-${end} di ${props.totalRows}`
  } else {
    const total = table.getFilteredRowModel().rows.length
    if (total === 0) return ''
    const start = pageIndex * pageSize + 1
    const end = Math.min((pageIndex + 1) * pageSize, total)
    return `${start}-${end} di ${total}`
  }
})

const exportCSV = () => {
  const rows = table.getFilteredRowModel().rows
  if (rows.length === 0) return

  // Estrae gli header
  const visibleColumns = table.getVisibleLeafColumns()
  const headers = visibleColumns.map(col => typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id)
  
  // Estrae i dati
  const csvRows = rows.map(row => {
    return visibleColumns.map(col => {
      const val = row.getValue(col.id)
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : String(val ?? '')
    }).join(',')
  })

  // Assembla il CSV
  const csvContent = [headers.join(','), ...csvRows].join('\n')
  
  // Scarica il file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `export_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
