# Organism Components Specs

Questa documentazione definisce in dettaglio i contratti per i componenti riutilizzabili (*organisms*) da costruire nell'app.

## StatCard (`src/components/organisms/StatCard.vue`)
- **Props**: `title: string`, `value: string|number`, `change?: number`, `icon?: Component`, `loading?: boolean`
- **Emits**: nessuno
- **Slots**: nessuno
- **`data-testid`**: `"stat-card"`, `"stat-value"`, `"stat-change"`
- **Stato Interno**: Nessuno

## TopList (`src/components/organisms/TopList.vue`)
- **Props**: `title: string`, `items: Array<{label: string, count: number, extra?: string}>`, `loading?: boolean`
- **Emits**: nessuno
- **Slots**: nessuno
- **`data-testid`**: `"top-list"`
- **Stato Interno**: max item a 10 e formattazione progress bar.

## DataTable (`src/components/organisms/DataTable.vue`)
- **Props**: `columns: ColumnDef<T>[]`, `data: T[]`, `loading?: boolean`, `totalRows?: number`, `pageSize?: number`, `searchable?: boolean`, `exportable?: boolean`
- **Emits**: `update:page`, `update:search`, `update:sort`, `update:selection`
- **Slots**: `#toolbar-actions`, `#row-actions`
- **`data-testid`**: `"data-table"`, `"search-input"`, `"sort-{columnId}"`, `"page-next"`, `"page-prev"`, `"export-csv"`, `"row-{index}"`, `"empty-state"`
- **Stato Interno**: paginazione, globalFilter locale se necessario.

## JobsMap (`src/components/organisms/JobsMap.vue`)
- **Props**: `jobs: Job[]`, `filters: Record<string, any>`
- **Emits**: `select-job` (payload: `Job`)
- **Slots**: nessuno
- **`data-testid`**: `"jobs-map"`
- **Stato Interno**: `filteredJobs` (computed derivato), istanza Mappa Google Maps e clusterer.

## MapFilters (`src/components/organisms/MapFilters.vue`)
- **Props**: `initialFilters: Record<string, any>`
- **Emits**: `update:filters`
- **Slots**: nessuno
- **`data-testid`**: `"map-filters"`, `"filter-skills"`, `"filter-remote"`, `"filter-reset"`
- **Stato Interno**: Form state reattivo per i campi di ricerca, radio group, select.

## LineChart (`src/components/organisms/charts/LineChart.vue`)
- **Props**: `title: string`, `series: Array<{name: string, data: number[]}>`, `xLabels: string[]`, `loading?: boolean`
- **`data-testid`**: `"chart-line"`

## BarChart (`src/components/organisms/charts/BarChart.vue`)
- **Props**: `title: string`, `data: Array<{label: string, value: number}>`, `horizontal?: boolean`, `loading?: boolean`
- **`data-testid`**: `"chart-bar"`

## DonutChart (`src/components/organisms/charts/DonutChart.vue`)
- **Props**: `title: string`, `data: Array<{name: string, value: number}>`, `loading?: boolean`
- **`data-testid`**: `"chart-donut"`

## HeatmapChart (`src/components/organisms/charts/HeatmapChart.vue`)
- **Props**: `title: string`, `data: Array<[number, number, number]>`, `xLabels: string[]`, `yLabels: string[]`, `loading?: boolean`
- **`data-testid`**: `"chart-heatmap"`

## AppSidebar (`src/components/layout/AppSidebar.vue`)
- **Props**: nessuno
- **Emits**: nessuno
- **Stato Interno**: Gestione sidebar collapsed/expanded, rotta corrente per highlight.
- **`data-testid`**: `"app-sidebar"`, `"nav-link-{name}"`, `"logout-btn"`

## ThemeToggle (`src/components/layout/ThemeToggle.vue`)
- **Props**: nessuno
- **Emits**: nessuno
- **`data-testid`**: `"theme-toggle"`
- **Stato Interno**: Reagisce a `useTheme()`.
