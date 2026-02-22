<script setup lang="ts" generic="T extends object">
import { computed, h, ref, useSlots } from "vue";
import type { ColumnDef, SortingState } from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  loading?: boolean;
  totalRows?: number;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pageSize: 25,
  searchable: true,
  exportable: false,
  selectable: true,
});

const { t } = useI18n();
const slots = useSlots();

const sorting = ref<SortingState>([]);
const globalFilter = ref("");
const rowSelection = ref({});
const pageSize = ref(props.pageSize);
const pageIndex = ref(0);

const hasRowActions = computed(() => Boolean(slots["row-actions"]));

const selectionColumn: ColumnDef<T, unknown> = {
  id: "select",
  header: ({ table }) =>
    props.selectable
      ? h(Checkbox, {
          checked: table.getIsAllPageRowsSelected(),
          "onUpdate:checked": table.getToggleAllPageRowsSelectedHandler(),
          "data-testid": "table-checkbox-all",
        })
      : null,
  cell: ({ row }) =>
    props.selectable
      ? h(Checkbox, {
          checked: row.getIsSelected(),
          "onUpdate:checked": row.getToggleSelectedHandler(),
        })
      : null,
  enableSorting: false,
  enableHiding: false,
};

const actionsColumn: ColumnDef<T, unknown> = {
  id: "actions",
  header: () => null,
  cell: ({ row }) => (slots["row-actions"] ? slots["row-actions"]({ row }) : null),
  enableSorting: false,
  enableHiding: false,
};

const resolvedColumns = computed(() => {
  const columns = [...props.columns];
  if (hasRowActions.value) columns.push(actionsColumn);
  if (props.selectable) columns.unshift(selectionColumn);
  return columns;
});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return resolvedColumns.value;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get pagination() {
      return { pageIndex: pageIndex.value, pageSize: pageSize.value };
    },
  },
  onPaginationChange: (updater) => {
    const current = { pageIndex: pageIndex.value, pageSize: pageSize.value };
    const next = typeof updater === "function" ? updater(current) : updater;
    pageIndex.value = next.pageIndex;
    pageSize.value = next.pageSize;
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === "function" ? updater(sorting.value) : updater;
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === "function" ? updater(globalFilter.value) : updater;
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value = typeof updater === "function" ? updater(rowSelection.value) : updater;
  },
  globalFilterFn: "includesString",
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

const rangeLabel = computed(() => {
  const total = props.totalRows ?? props.data.length;
  const from = total === 0 ? 0 : pageIndex.value * pageSize.value + 1;
  const to = Math.min(total, (pageIndex.value + 1) * pageSize.value);
  return t("table.range", { from, to, total });
});

const selectedCount = computed(() => table.getSelectedRowModel().rows.length);

function exportCsv() {
  const rows = table.getRowModel().rows.map((row) => row.original);
  const firstRow = rows[0];
  if (!firstRow) return;

  const headers = Object.keys(firstRow as Record<string, unknown>);
  const csv = [headers.join(",")];
  rows.forEach((row) => {
    const values = headers.map((key) => {
      const value = row[key as keyof T];
      const stringValue = value === null || value === undefined ? "" : String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    });
    csv.push(values.join(","));
  });

  const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "export.csv";
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="stack-md" data-testid="data-table">
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <Input
          v-if="searchable"
          data-testid="search-input"
          class="table-search-input"
          :placeholder="t('table.search')"
          :model-value="globalFilter"
          @update:model-value="(value) => table.setGlobalFilter(value)"
        />
        <slot name="toolbar-actions" />
      </div>
      <div class="table-toolbar-right">
        <span v-if="selectedCount" class="table-selected-count">
          {{ t("table.selected", { count: selectedCount }) }}
        </span>
        <Button
          v-if="exportable"
          data-testid="export-csv"
          variant="outline"
          size="sm"
          @click="exportCsv"
        >
          {{ t("table.export") }}
        </Button>
      </div>
    </div>

    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <div
              v-if="!header.isPlaceholder"
              class="table-column-header"
              :data-testid="`sort-${header.id}`"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              <ArrowDownUp v-if="header.column.getCanSort()" class="icon-sm icon-muted" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell :colspan="table.getAllColumns().length" class="table-loading-cell">
            <div class="table-loading-skeleton">
              <Skeleton v-for="index in 5" :key="index" class="h-6 w-full" />
            </div>
          </TableCell>
        </TableRow>
        <TableRow v-else-if="table.getRowModel().rows.length === 0">
          <TableCell :colspan="table.getAllColumns().length">
            <div class="table-empty-state" data-testid="empty-state">
              {{ t("table.empty") }}
            </div>
          </TableCell>
        </TableRow>
        <TableRow
          v-for="(row, index) in table.getRowModel().rows"
          :key="row.id"
          :data-testid="`row-${index}`"
        >
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <div class="table-cell-content">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="table-pagination">
      <span>{{ rangeLabel }}</span>
      <div class="table-pagination-buttons">
        <Button
          variant="ghost"
          size="icon"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <ChevronsLeft class="icon-sm" />
        </Button>
        <Button
          data-testid="page-prev"
          variant="ghost"
          size="icon"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <ChevronLeft class="icon-sm" />
        </Button>
        <Button
          data-testid="page-next"
          variant="ghost"
          size="icon"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <ChevronRight class="icon-sm" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <ChevronsRight class="icon-sm" />
        </Button>
      </div>
    </div>
  </div>
</template>
