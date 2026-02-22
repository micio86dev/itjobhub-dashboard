# COMPONENTS SPECIFICATION — Admin Dashboard

Specifica completa di tutti i componenti riutilizzabili (atoms, molecules, organisms).

---

## 🏗️ Component Hierarchy

```
Layouts/
  ├─ AuthLayout.vue
  └─ DashboardLayout.vue

Components/
  ├─ layout/
  │  ├─ AppSidebar.vue
  │  ├─ AppHeader.vue
  │  └─ ThemeToggle.vue
  │
  ├─ molecules/
  │  └─ (future small components)
  │
  └─ organisms/
     ├─ StatCard.vue
     ├─ TopList.vue
     ├─ DataTable.vue
     │
     ├─ charts/
     │  ├─ LineChart.vue
     │  ├─ BarChart.vue
     │  ├─ DonutChart.vue
     │  ├─ HeatmapChart.vue
     │  └─ [ChartSkeleton]
     │
     └─ maps/
        ├─ JobsMap.vue
        └─ MapFilters.vue
```

---

## 📦 Layout Components

### **AuthLayout.vue**

**Path**: `src/layouts/AuthLayout.vue`

Desktop: split screen (left brand, right form)  
Mobile: full-screen form

**Props**:

```typescript
interface Props {
  // nessuna prop — usa default slot
}
```

**Slots**:

```typescript
// default slot contiene il form (LoginPage lo occupa)
<slot></slot>
```

**Features**:

- Logo + tagline sinistra ("Il portale per tech jobs")
- Brand color verde (#22c55e)
- ThemeToggle top-right
- Responsive: 1 colonna mobile, 2 desktop

**data-testid**:

- `auth-layout`
- `brand-section` (left side)
- `form-section` (right side)

---

### **DashboardLayout.vue**

**Path**: `src/layouts/DashboardLayout.vue`

Grid layout: fixed sidebar + main content scrollable

**Props**:

```typescript
interface Props {
  // nessuna prop
}
```

**Slots**:

```typescript
// default slot per il contenuto della pagina
<slot></slot>
```

**Components Usage**:

- Include `AppSidebar`
- Include `AppHeader`
- Slot default contiene il contenuto della pagina

**Responsive**:

- Mobile: hamburger button apre sidebar in Sheet drawer
- Tablet: sidebar icons-only collapsible
- Desktop: sidebar full width

**data-testid**:

- `dashboard-layout`
- `dashboard-main`

---

## 🎨 Layout Sub-Components

### **AppSidebar.vue**

**Path**: `src/components/layout/AppSidebar.vue`

Barra navigazione fissa sinistra con menu principale.

**Props**: none

**State**:

```typescript
isCollapsed: ref(false); // on tablet/desktop toggle
```

**Navigation Items** (emit click, router naviga):

```typescript
interface NavItem {
  label: string; // i18n key, es. "sidebar.overview"
  icon: VueComponent; // Lucide icon
  path: string; // router path
  badge?: number; // optional count badge
  disabled?: boolean;
}
```

Items:

1. LayoutDashboard → `/dashboard`
2. Users → `/dashboard/users`
3. Building2 → `/dashboard/companies`
4. Briefcase → `/dashboard/jobs`
5. Map → `/dashboard/jobs/map`
6. Newspaper → `/dashboard/news`
7. BarChart3 → `/dashboard/analytics`
8. Wrench → `/dashboard/skills`

**Features**:

- Logo + app name top
- Active link evidenziato (bg-brand-50, text-brand-700)
- Footer: avatar utente + nome + logout button
- Collapse su md breakpoint → icons only
- Smooth transitions (200ms)

**data-testid**:

- `app-sidebar`
- `nav-item-{path}` per ogni link
- `logout-button`
- `sidebar-avatar`

---

### **AppHeader.vue**

**Path**: `src/components/layout/AppHeader.vue`

Header superiore con titulo, breadcrumb, azioni globali.

**Props**:

```typescript
interface Props {
  title?: string; // titolo pagina (auto da route.meta)
}
```

**State**:

```typescript
breadcrumbs: computed(() => route.meta.breadcrumb || []);
currentUser: computed(() => authStore.user);
```

**Sections**:

1. **Left**: Breadcrumb dinamico (o hamburger menu mobile)
2. **Center**: Titolo pagina
3. **Right**:
   - Language selector (Dropdown: IT | EN | FR | ES | DE)
   - ThemeToggle (Sun/Moon icon)
   - Avatar + DropdownMenu: "Profilo" (placeholder), "Logout"

**data-testid**:

- `app-header`
- `breadcrumb`
- `language-selector`
- `avatar-menu`
- `logout-menu-item`

---

### **ThemeToggle.vue**

**Path**: `src/components/layout/ThemeToggle.vue`

Toggle light/dark mode con icone Sun/Moon.

**Props**: none

**Composables**:

```typescript
const { theme, toggleTheme } = useTheme();
```

**Features**:

- Icona Sun (light) / Moon (dark)
- Click toggle tema
- Transizione 300ms smooth
- Persiste su cookie

**data-testid**: `theme-toggle`

---

## 🔤 Organism Components

### **StatCard.vue**

**Path**: `src/components/organisms/StatCard.vue`

Card per mostrare una metrica singola con trend.

**Props**:

```typescript
interface Props {
  title: string; // i18n key, "stats.users"
  value: string | number; // "1.234" o 1234
  change?: number; // % change, es. +5 o -2
  icon?: Component; // Lucide icon (optional)
  loading?: boolean; // mostra skeleton se true
  trend?: "up" | "down" | "neutral"; // auto-calcolato da change
}
```

**Slots**: none

**Features**:

- Title in testo grigio piccolo (i18n)
- Value in testo grande bold
- Change con freccia + colore: verde ↑ (positivo), rosso ↓ (negativo)\*
- Icon optional (top left corner)
- Loading state: Skeleton al posto di value
- Hover: ombra più marcata, transizione 200ms
- Card: border sottile, rounded-lg

**data-testid**:

- `stat-card`
- `stat-value`
- `stat-change`
- `stat-loading` (quando loading=true)

---

### **TopList.vue**

**Path**: `src/components/organisms/TopList.vue`

Lista di item con ranking numerico e barre di progresso orizzontali.

**Props**:

```typescript
interface Props {
  title: string; // i18n key
  items: Array<{
    label: string;
    count: number;
    extra?: string; // optional info (es. "in 3 job")
  }>;
  loading?: boolean;
  maxItems?: number; // default 10
}
```

**Features**:

- Titolo in header
- Ogni item: numero ranking (1-10), label, barra progresso verde, count numerico
- Barra progresso: width % proporzionale a max count
- Se items > maxItems: mostra max items, poi "e altri N..."
- Loading: skeleton lines animate
- Empty state: "Nessun dato" message

**data-testid**:

- `top-list`
- `top-list-item-{index}`
- `top-list-progress-bar`

---

### **DataTable.vue**

**Path**: `src/components/organisms/DataTable.vue`

Tabella generica tipizzata, riutilizzabile, con sort, filtro, paginazione.

**Props**:

```typescript
interface Props {
  columns: ColumnDef<T>[]; // @tanstack/vue-table
  data: T[];
  loading?: boolean;
  totalRows?: number; // per paginazione server-side
  pageSize?: number; // default 25
  searchable?: boolean; // mostra input search
  exportable?: boolean; // mostra button CSV
  selectable?: boolean; // checkbox per riga
}
```

**Emits**:

```typescript
emit("pagination-change", { page, pageSize });
emit("sort-change", { columnId, direction });
emit("filter-change", { columnId, value });
emit("selection-change", selectedRows);
emit("export-csv", visibleRows);
```

**Slots**:

```typescript
// toolbar custom actions
<slot name="toolbar-actions"></slot>

// azioni per riga (es. delete, edit)
<slot name="row-actions" :row="row"></slot>
```

**Features**:

- Sorting: click header → asc/desc + freccia icona
- Filtro globale: input search (data-testid="search-input")
- Paginazione: nav buttons prev/next/first/last, indicatore "1-25 di 340"
- Selezione righe: checkbox column, count "N selezionati"
- Export CSV: button genera CSV delle righe visibili
- Skeleton: 5 righe placeholder animate durante loading
- Empty state: illustrazione + testo "Nessun risultato"
- Responsive: scroll orizzontale su mobile

**data-testid**:

- `data-table`
- `search-input`
- `sort-{columnId}`
- `page-next`, `page-prev`
- `export-csv`
- `row-{index}`
- `empty-state`
- `table-checkbox-all` (select all)

---

## 📊 Chart Components

Tutti i chart usano `vue-echarts` + `echarts`.

### **LineChart.vue**

**Path**: `src/components/organisms/charts/LineChart.vue`

Grafico a linee con area fill.

**Props**:

```typescript
interface Props {
  title: string; // i18n key
  series: Array<{
    name: string;
    data: number[];
  }>;
  xLabels: string[]; // Date o label
  loading?: boolean;
  timeFormat?: "day" | "week" | "month"; // auto-formato asse X
}
```

**Features**:

- Linea verde brand (#22c55e)
- Area sotto linea con fill semi-trasparente (opacity 0.2)
- Tooltip su hover
- Legenda se > 1 serie
- Grid sottile
- Responsive
- Tema adattato a light/dark mode
- Skeleton durante loading (ChartSkeleton)

**data-testid**: `line-chart`

---

### **BarChart.vue**

**Path**: `src/components/organisms/charts/BarChart.vue`

Grafico a barre verticali.

**Props**:

```typescript
interface Props {
  title: string;
  series: Array<{
    name: string;
    data: number[];
  }>;
  xLabels: string[];
  loading?: boolean;
  orientation?: "vertical" | "horizontal"; // default vertical
}
```

**Features**:

- Barre colore brand
- Tooltip con valore
- Legenda se > 1 serie
- Responsive
- Light/dark theme

**data-testid**: `bar-chart`

---

### **DonutChart.vue**

**Path**: `src/components/organisms/charts/DonutChart.vue`

Grafico a ciambella (donut/pie).

**Props**:

```typescript
interface Props {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  loading?: boolean;
  showLegend?: boolean; // default true
}
```

**Features**:

- Colori diversi per ogni categoria
- Tooltip con % e valore assoluto
- Centro vuoto (donut style)
- Legenda a destra
- Responsive
- Light/dark theme

**data-testid**: `donut-chart`

---

### **HeatmapChart.vue**

**Path**: `src/components/organisms/charts/HeatmapChart.vue`

Grafico heatmap per pattern temporali (ora × giorno della settimana).

**Props**:

```typescript
interface Props {
  title: string;
  data: Array<[hour: number, day: number, value: number]>;
  // es. [[9, 0, 5], [9, 1, 8], ...] → ore 0-23, giorni 0-6 (mon-sun)
  loading?: boolean;
}
```

**Features**:

- Grid colori da freddo (basso) a caldo (alto)
- Tooltip con ora, giorno, valore
- Assi etichettati (0-23 ore, Mon-Sun)
- Responsive
- Light/dark theme

**data-testid**: `heatmap-chart`

---

### **ChartSkeleton.vue** (internal)

**Path**: `src/components/organisms/charts/ChartSkeleton.vue`

Placeholder animato durante loading dei chart.

**Props**:

```typescript
interface Props {
  title?: string;
  lines?: number; // quante righe di skeleton (default 3)
}
```

**Features**:

- Animazione pulse
- Simula forma del grafico

---

## 🗺️ Map Components

### **JobsMap.vue**

**Path**: `src/components/organisms/maps/JobsMap.vue`

Mappa interattiva con job marker e clustering.

**Props**:

```typescript
interface Props {
  jobs: Job[];
  filters?: {
    skills?: string[];
    type?: string;
    level?: string;
    // ... altri filtri
  };
  loading?: boolean;
  initialZoom?: number; // default 10
  initialCenter?: [lat: number, lng: number];
}
```

**Emits**:

```typescript
emit("marker-click", job);
emit("cluster-click", cluster);
emit("map-bounds", bounds); // per filtro bounds
```

**Features**:

- Google Maps embedded
- Marker clustering (@googlemaps/markerclusterer)
- Marker color: green per job, cluster icon con count
- Click marker → popup con job info (titolo, company, location)
- Click cluster → zoom in
- Filter dinamico: nasconde marker non-matching
- Responsive
- Skeleton durante loading (ChartSkeleton o simile)

**data-testid**:

- `jobs-map`
- `jobs-map-container`
- `job-marker-{jobId}`

---

### **MapFilters.vue**

**Path**: `src/components/organisms/maps/MapFilters.vue`

Pannello filtri per JobsMap.

**Props**:

```typescript
interface Props {
  availableSkills: string[];
  availableTypes: string[];
  loading?: boolean;
  selectedFilters?: {
    skills?: string[];
    type?: string;
    level?: string;
  };
}
```

**Emits**:

```typescript
emit("filters-change", {
  skills: [],
  type: undefined,
  level: undefined,
});
```

**Features**:

- Multiselect skill (searchable)
- Select type (dropdown)
- Select level (dropdown)
- Collapse button per nascondere
- Live preview "N job trovati"

**data-testid**:

- `map-filters`
- `map-filters-skill`
- `map-filters-type`

---

## 🔧 Composables (not components, but listed for reference)

### **useTheme()**

**Path**: `src/composables/useTheme.ts`

```typescript
export function useTheme() {
  const theme = ref<'light' | 'dark'>('light');

  function toggleTheme() { ... }
  function setMode(mode: 'light' | 'dark') { ... }

  return { theme: readonly(theme), toggleTheme, setMode };
}
```

### **useAuth()** → `useAuthStore()`

**Path**: `src/stores/auth.store.ts` (Pinia store, non composable)

### **useFilters()** (if needed)

**Path**: `src/composables/useFilters.ts`

Helper per managiare filtri di paginazione, sort, search in tabelle.

---

## 📐 Global Styles & Tokens

**File**: `src/styles/global.css` + `tailwind.config.ts`

```
Font:
  - Body: Inter, 300-400 weight
  - Heading: Inter, 600-700 weight

Colors (tailwind):
  - brand-50: #f0fdf4
  - brand-500: #22c55e (primary)
  - brand-600: #16a34a
  - brand-700: #15803d
  - brand-900: #14532d

  - background: white / #09090b dark
  - text: #09090b / #fafafa dark

Border radius:
  - lg: 12px (card)
  - md: 8px (input)

Transitions:
  - hover: 200ms ease
  - theme: 300ms ease

Shadows:
  - subtle: 0 1px 3px rgba(0,0,0,0.1)
  - medium: 0 4px 6px rgba(0,0,0,0.1)
```

---

## ✅ Testing Notes

- **StatCard.spec.ts**: testa rendering, skeleton, change colors
- **DataTable.spec.ts**: testa sorting, filtro, paginazione, export
- **JobsMap.spec.ts**: verifica caricamento mappa, marker clustering (non mockare Google Maps)
- **Charts.spec.ts**: verifica rendering serie, tema dark/light

---

## 🚀 Import Examples

```ts
// Layouts
import AuthLayout from "@/layouts/AuthLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

// Layout components
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import ThemeToggle from "@/components/layout/ThemeToggle.vue";

// Organisms
import StatCard from "@/components/organisms/StatCard.vue";
import TopList from "@/components/organisms/TopList.vue";
import DataTable from "@/components/organisms/DataTable.vue";

// Charts
import LineChart from "@/components/organisms/charts/LineChart.vue";
import BarChart from "@/components/organisms/charts/BarChart.vue";
import DonutChart from "@/components/organisms/charts/DonutChart.vue";
import HeatmapChart from "@/components/organisms/charts/HeatmapChart.vue";

// Maps
import JobsMap from "@/components/organisms/maps/JobsMap.vue";
import MapFilters from "@/components/organisms/maps/MapFilters.vue";

// Composables
import { useTheme } from "@/composables/useTheme";
import { useAuthStore } from "@/stores/auth.store";
```
