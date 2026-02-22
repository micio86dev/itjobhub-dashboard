# STORES SPECIFICATION — Pinia State Management

Specifica degli store Pinia globali per l'applicazione Admin Dashboard.

---

## 📦 Store Architecture

```
stores/
  ├─ auth.store.ts          # Autenticazione, utente corrente
  ├─ theme.store.ts         # Light/dark mode
  └─ filters.store.ts       # Filtri globali, search state
```

---

## 🔐 Auth Store

**Path**: `src/stores/auth.store.ts`

Gestisce lo stato di autenticazione, token JWT, dati utente.

### State

```typescript
interface AuthState {
  token: string | null; // JWT token dell'admin
  refreshToken: string | null; // Refresh token (se disponibile)
  user: User | null; // Dati utente corrente
  loading: boolean; // Operazione in corso (login/logout)
  error: string | null; // Ultimo errore di auth
}
```

### Getters

```typescript
// @computed
isAuthenticated(): boolean {
  // true se token exist e user exist
  return !!this.token && !!this.user;
}

userName(): string {
  return this.user?.first_name + ' ' + this.user?.last_name || '';
}

userRole(): UserRole | null {
  return this.user?.role || null;
}

isAdmin(): boolean {
  return this.user?.role === 'admin';
}
```

### Actions

```typescript
// POST /auth/login
async login(email: string, password: string): Promise<void> {
  // 1. Chiama apiFetch<AuthResponse>('POST', '/auth/login', { email, password })
  // 2. Salva token in this.token e refreshToken nel cookie
  // 3. Salva user in this.user
  // 4. Error? Setta this.error, throw
  // 5. Resetta this.error
  this.loading = true;
  // ... implementation
  this.loading = false;
}

// POST /auth/logout
async logout(): Promise<void> {
  // 1. Chiama apiFetch('POST', '/auth/logout')
  // 2. Pulisce token (this.token = null)
  // 3. Pulisce user (this.user = null)
  // 4. Rimuove cookie 'admin-token'
  // 5. Router.push('/login')
  // Non importa se logout API fallisce — pulisci comunque stato locale
}

// GET /auth/user
async fetchMe(): Promise<void> {
  // Ricarica user se token valido
  // Se errore 401 → logout automatico
  // Usato su app startup per ripopolare user dal token salvato
}

// POST /auth/refresh
async refreshToken(): Promise<void> {
  // Se refreshToken disponibile, chiedi nuovo JWT token
  // Aggiorna this.token
  // Se fallisce → logout()
}

// Legacy per logout: utilizza composable, non action diretta
clearAuthError(): void {
  this.error = null;
}
```

### Implementation Notes

- Token salvato in cookie **'admin-token'** con `js-cookie`
- Cookie: `httpOnly` (se possibile), `max-age: 7 days`
- Su app init (`main.ts`), se cookie esiste → `fetchMe()` per idratare user
- Se ricevi 401 da qualsiasi API → `logout()` automatico (nel HTTP client interceptor)

---

## 🎨 Theme Store

**Path**: `src/stores/theme.store.ts`

Gestisce preferenza light/dark mode e persistenza.

### State

```typescript
interface ThemeState {
  mode: "light" | "dark";
}
```

### Getters

```typescript
isDarkMode(): boolean {
  return this.mode === 'dark';
}
```

### Actions

```typescript
// Leggi dal cookie 'admin-theme', fallback a preferenza sistema
initialize(): void {
  // 1. Se cookie 'admin-theme' esiste → this.mode = cookie value
  // 2. Altrimenti, se window.matchMedia('(prefers-color-scheme: dark)') → this.mode = 'dark'
  // 3. Altrimenti → this.mode = 'light' (default)
  // 4. Applica classe 'dark' a document.documentElement se dark
  // Chiamare in main.ts prima di mount app
}

// Toggle light ↔ dark
toggleTheme(): void {
  // 1. if this.mode === 'light' → 'dark', else → 'light'
  // 2. Scrivi cookie 'admin-theme' (max-age: 365 giorni)
  // 3. Applica/rimuovi classe 'dark' su document.documentElement
  // 4. Notifica store subscribers (watcher nel app.vue o componenti)
}

// Set esplicito a uno dei due modi
setMode(mode: 'light' | 'dark'): void {
  // 1. this.mode = mode
  // 2. Scrivi cookie
  // 3. Applica classe DOM
}
```

### Watchers (nel componente che usa il store)

Non implementare watcher nello store, ma nei componenti:

```vue
<script setup>
const themeStore = useThemeStore();

watchEffect(() => {
  // Se themeStore.mode cambia, reagisci
  const isDark = themeStore.isDarkMode;
  // Passa isDark ai chart (ECharts), Google Maps, ecc.
});
</script>
```

### CSS Class Toggle

```typescript
// In setMode() action
if (mode === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
```

---

## 🔍 Filters Store

**Path**: `src/stores/filters.store.ts`

Gestisce stato globale dei filtri (search, sort, paginazione) per le tabelle.

> **Note**: Questo store è **optional** se ogni pagina gestisce i propri filtri via component state. Se moltissime pagine condividono filtri simili, conviene store globale.

### State

```typescript
interface FilterState {
  // Global search across all pages
  globalSearch: string;

  // Pagination state
  currentPage: number; // default 1
  pageSize: number; // default 25

  // Sort state
  sortBy: string | null; // column id
  sortDirection: "asc" | "desc"; // default 'asc'

  // Entity-specific filters (optional, se serve)
  jobFilters?: {
    skills: string[];
    type?: string;
    level?: string;
  };
  companyFilters?: {
    industry?: string;
    verified?: boolean;
  };
}
```

### Getters

```typescript
// Calcolo offset per API call
pageOffset(): number {
  return (this.currentPage - 1) * this.pageSize;
}

// Export query params per API
asQueryParams(): Record<string, any> {
  return {
    page: this.currentPage,
    limit: this.pageSize,
    sort: this.sortBy ? `${this.sortBy}:${this.sortDirection}` : undefined,
    search: this.globalSearch || undefined,
  };
}
```

### Actions

```typescript
// Setta search globale
setGlobalSearch(query: string): void {
  this.globalSearch = query;
  this.currentPage = 1; // Reset a pagina 1 se filtro cambia
}

// Setta pagina corrente
setPage(page: number): void {
  this.currentPage = Math.max(1, page);
}

// Setta size pagine
setPageSize(size: number): void {
  this.pageSize = Math.max(1, size);
  this.currentPage = 1;
}

// Setta sort
setSort(columnId: string, direction: 'asc' | 'desc'): void {
  if (this.sortBy === columnId && this.sortDirection === direction) {
    // Se clicco stesso header → toggle direction
    this.sortDirection = direction === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortBy = columnId;
    this.sortDirection = direction;
  }
}

// Reset a valori default
reset(): void {
  this.globalSearch = '';
  this.currentPage = 1;
  this.pageSize = 25;
  this.sortBy = null;
  this.sortDirection = 'asc';
}
```

### Usage Example

```vue
<script setup>
import { useFiltersStore } from '@/stores/filters.store';

const filtersStore = useFiltersStore();

async function loadJobs() {
  const params = filtersStore.asQueryParams();
  const response = await getJobs(params);
  // ...
}

function handleSearch(query: string) {
  filtersStore.setGlobalSearch(query);
  loadJobs();
}
</script>
```

---

## 🚀 Store Initialization

### main.ts

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Crea app
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Inizializza store PRIMA di mount
const themeStore = useThemeStore();
themeStore.initialize(); // Setup light/dark

const authStore = useAuthStore();
// Se cookie token esiste → fetchMe() per idratare user
if (Cookies.get("admin-token")) {
  await authStore.fetchMe();
}

app.mount("#app");
```

---

## 🔄 Store Reactivity

Usare `computed()` e `watchEffect()` nei componenti:

```vue
<script setup>
import { computed, watchEffect } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isAuthenticated);
const userName = computed(() => authStore.userName);

watchEffect(() => {
  // Reagisci a cambi di user
  console.log("User changed:", authStore.user);
});
</script>

<template>
  <div v-if="isLoggedIn">
    <p>Welcome {{ userName }}</p>
  </div>
</template>
```

---

## 🧪 Testing Stores

Usare `createTestingPinia()` in Vitest:

```typescript
import { createTestingPinia } from "@pinia/testing";
import { useAuthStore } from "@/stores/auth.store";

describe("auth.store", () => {
  let authStore;

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    authStore = useAuthStore(pinia);
  });

  it("should login and set token", async () => {
    await authStore.login("user@test.com", "password");
    expect(authStore.token).toBeDefined();
    expect(authStore.user).toBeDefined();
  });
});
```

---

## 📋 Store Checklist

- [ ] `auth.store.ts` — login, logout, fetchMe, token/user state
- [ ] `theme.store.ts` — light/dark toggle, persistence
- [ ] `filters.store.ts` — search, pagination, sort (optional)
- [ ] `main.ts` — initialize prima di mount
- [ ] `HTTP client interceptor` — logout on 401
- [ ] Cookie helpers — js-cookie per persistence
- [ ] Test unit per ogni store
