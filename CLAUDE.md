# DevBoards Admin Dashboard - CLAUDE.md

## Stack

- **Frontend**: Vue 3 + Vite + TypeScript
- **Styling**: Tailwind CSS 4
- **Router**: Vue Router 4
- **State**: Pinia
- **HTTP**: Axios
- **Path alias**: `@/` → `src/`

## API

- **Base URL**: `http://localhost:3001`
- **Auth**: JWT Bearer token (`Authorization: Bearer <token>`)
- **Token storage**: `localStorage.getItem('auth_token')`
- **Response format**: `{ success: boolean, status: number, message: string, data: T }`

## Regole assolute

1. **Un compito per sessione** - non fare più cose contemporaneamente
2. **Verifica sempre** - dopo ogni file, esegui `npm run build` e correggi gli errori prima di continuare
3. **No componenti UI di terze parti** - solo Tailwind classes
4. **TypeScript strict** - niente `any`, usa i tipi definiti in `src/types/`
5. **Commit dopo ogni fase** - `git add -A && git commit -m "feat: ..."`

## Struttura cartelle

```
src/
  api/          # Client API (un file per gruppo)
  stores/       # Pinia stores
  views/        # Pagine (una per route)
  components/   # Componenti riusabili
  types/        # TypeScript interfaces
  router/       # Vue Router config
  lib/          # axios instance e utils
```

## Fasi di sviluppo (RISPETTA L'ORDINE)

1. Setup base (Vite + Vue + Tailwind + Router + Pinia + Axios) ✓
2. Types (src/types/\*.ts)
3. API client (src/\*.ts)
4. Auth store + Login page
5. Layout shell (sidebar + header)
6. Dashboard page
7. Pagine successive una alla volta

## Convenzioni

- Componenti: PascalCase (`JobsTable.vue`)
- Composables: camelCase con `use` prefix (`useAuth.ts`)
- Store: camelCase (`useAuthStore`)
- API functions: camelCase (`getJobs`, `createJob`)
- Tutti i testi UI: i18n ready (usa `t('key')` e definisci le chiavi in `src/locales/`)
- Errori API: mostra `error.response.data.message` se disponibile, altrimenti un
