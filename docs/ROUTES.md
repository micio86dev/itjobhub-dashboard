# ROUTES SPECIFICATION — Admin Dashboard

Documentazione di tutte le route dell'applicazione Vue.js + Vue Router.

> **Base Path**: `/dashboard`  
> **Auth**: Token JWT in `Authorization` header (auto-aggiunto dall'HTTP client)

---

## 📍 Route Map

| Path                   | Componente              | Layout          | Auth | Scopo                            | Dati caricati                            |
| ---------------------- | ----------------------- | --------------- | ---- | -------------------------------- | ---------------------------------------- |
| `/login`               | LoginPage               | AuthLayout      | No   | Autenticazione admin             | -                                        |
| `/dashboard`           | OverviewPage            | DashboardLayout | Sì   | Overview statistiche             | stats, charts                            |
| `/dashboard/users`     | UsersPage               | DashboardLayout | Sì   | Lista utenti + filtri            | users paginati (TODO: endpoint mancante) |
| `/dashboard/companies` | CompaniesPage           | DashboardLayout | Sì   | Lista companies in grid          | companies paginati                       |
| `/dashboard/jobs`      | JobsPage                | DashboardLayout | Sì   | Lista jobs + filtri avanzati     | jobs paginati                            |
| `/dashboard/jobs/map`  | JobsMapPage             | DashboardLayout | Sì   | Visualizzazione jobs su mappa    | jobs con GPS                             |
| `/dashboard/news`      | NewsPage                | DashboardLayout | Sì   | Lista news + filtri              | news paginati                            |
| `/dashboard/analytics` | AnalyticsPage           | DashboardLayout | Sì   | Analytics avanzate multi-periodo | logs, stats per periodo                  |
| `/dashboard/skills`    | SkillsPage              | DashboardLayout | Sì   | Top skills aggregate             | skills da jobs                           |
| `/404`                 | NotFoundPage            | -               | -    | Pagina non trovata               | -                                        |
| `*`                    | NotFoundPage (redirect) | -               | -    | Catch-all                        | -                                        |

---

## 🔐 Auth Flow

```
Route visitor
    │
    ├─ Auth required? (meta.requiresAuth === true)
    │   │
    │   ├─ YES  → isAuthenticated?
    │   │        ├─ YES  → ✅ Proceed
    │   │        └─ NO   → ❌ Redirect /login
    │   │
    │   └─ NO   → ✅ Proceed (check: if already logged in, redirect /dashboard)
    │
    └─ Route change complete → load component lazy
```

**Implementazione**: Navigation guard globale in `src/router/index.ts`

```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login" });
  }

  if (to.name === "login" && authStore.isAuthenticated) {
    return next({ name: "dashboard-overview" });
  }

  next();
});
```

---

## 📄 Layout Details

### AuthLayout

- Split screen desktop: brand left (verde), form right
- Mobile: form full-screen
- ThemeToggle top-right
- Logo, tagline "Il portale per tech jobs"

### DashboardLayout

- Fixed sidebar left (320px) con AppSidebar
- Main content area right (scrollable)
- AppHeader top con title, breadcrumb, language selector, theme toggle
- Mobile: sidebar in Sheet drawer (triggered by hamburger)

---

## 🎯 Route Meta Definizioni

```typescript
interface RouteMeta {
  requiresAuth?: boolean; // se vero, redirect a /login se non autenticato
  title?: string; // titolo pagina (per <title> tag)
  breadcrumb?: Array<{ name: string; path?: string }>;
  description?: string; // meta description
  layout?: "auth" | "dashboard" | "empty";
}
```

---

## ⚡ Lazy Loading

Tutte le pagine usano dynamic import per ridurre il bundle:

```typescript
// ❌ WRONG
import OverviewPage from "@/pages/dashboard/OverviewPage.vue";

// ✅ CORRECT
const OverviewPage = () => import("@/pages/dashboard/OverviewPage.vue");
```

---

## 🚀 Redirect & Fallback

- `/` (home) → redirect a `/dashboard`
- Route non trovata `*` → `/404` (NotFoundPage)
- Access denied (not admin) → error 403, stay on page con alert

---

## 📱 Responsive Behavior

| Breakpoint              | Change                                         |
| ----------------------- | ---------------------------------------------- |
| < 640px (mobile)        | Sidebar in Sheet, full-width main              |
| 640px - 1024px (tablet) | Sidebar collapsible (icons only), 50/50 layout |
| > 1024px (desktop)      | Normal sidebar + main                          |

---

## 🔗 Named Routes (per uso in template/code)

```typescript
// In router config
{
  name: 'login',
  path: '/login',
  ...
}
{
  name: 'dashboard-overview',
  path: '/dashboard',
  ...
}
{
  name: 'dashboard-jobs',
  path: '/dashboard/jobs',
  ...
}
// etc.
```

Uso:

```vue
<RouterLink :to="{ name: 'dashboard-jobs' }">Vai a Jobs</RouterLink>
<!-- or programmatic -->
router.push({ name: 'dashboard-jobs', query: { page: 2 } })
```

---

## 🌍 Query Parameters

### JobsPage query params

- `?page=1` — numero pagina
- `?limit=25` — risultati per pagina
- `?skills=JavaScript,React` — filtro skill
- `?search=developer` — ricerca libera

### JobsMapPage query params

- `?zoom=10` — zoom mappa
- `?center=45.46,9.19` — centro mappa [lat, lng]
- `?cluster=true` — attiva clustering marker

### AnalyticsPage query params

- `?period=month` — 7d | 30d | 90d | 365d | custom
- `?from=2026-01-01&to=2026-02-22` — custom range

---

## 📍 Breadcrumb Examples

| Path                   | Breadcrumb                 |
| ---------------------- | -------------------------- |
| `/dashboard`           | `Dashboard > Overview`     |
| `/dashboard/jobs`      | `Dashboard > Jobs`         |
| `/dashboard/jobs/map`  | `Dashboard > Jobs > Mappa` |
| `/dashboard/companies` | `Dashboard > Companies`    |
| `/dashboard/analytics` | `Dashboard > Analytics`    |

---

## ⚠️ TODO & Known Issues

None documented — all endpoints in API_REFERENCE.md.

---

## 🧪 E2E Test Routes (Playwright)

```typescript
// Esempi di rotte per E2E tests
test("navigazione completa", async ({ page }) => {
  await page.goto("/login");
  // login...
  await page.goto("/dashboard");
  // verifica overview carica...
});
```
