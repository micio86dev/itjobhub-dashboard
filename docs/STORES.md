# Stores Specs

Questa documentazione definisce le specifiche per i tre principali Pinia store dell'admin dashboard.

## `auth.store` (`src/stores/auth.store.ts`)

- **State Shape**:
  ```typescript
  interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
  }
  ```
- **Actions**:
  - `login(email: string, password: string): Promise<void>` -> Setta header axios, salva in local storage, riempie state
  - `logout(): Promise<void>` -> Rimuove token, reimposta state
  - `fetchCurrentUser(): Promise<void>` -> Refresha i dati di `user` dal backend
- **Getters**:
  - `isAuthenticated: boolean` -> `!!state.accessToken && !!state.user`

## `theme.store` (`src/stores/theme.store.ts` o via Composable `useTheme`)

- **State Shape**:
  ```typescript
  interface ThemeState {
    mode: 'light' | 'dark' | 'system';
  }
  ```
- **Actions**:
  - `setMode(mode: 'light' | 'dark' | 'system'): void` -> Scrive proxy state, aggiorna class lista sull'HTML document e cookie 'admin-theme'
  - `toggleTheme(): void` -> Passa da light a dark o viceversa
- **Getters**:
  - `isDark: boolean` -> Ritorna true se mode è 'dark' (o se 'system' su OS in dark mode)

## `filters.store` (`src/stores/filters.store.ts`)

Opzionale, utile se si desidera persistere i filtri mappa avanzati attraverso la navigazione.
- **State Shape**:
  ```typescript
  interface FiltersState {
    jobsMap: {
      skills: string[];
      remote: 'remote' | 'hybrid' | 'onsite' | null;
      company: string | null;
      contractType: string | null;
      experienceLevel: string | null;
      publishedWithin: 7|30|90|null;
    };
  }
  ```
- **Actions**:
  - `updateJobsMapFilters(filters: Partial<FiltersState['jobsMap']>): void`
  - `resetJobsMapFilters(): void`
- **Getters**:
  - `activeJobMapFiltersCount: number` -> Conta quanti filtri (diverso da empty o null) sono applicati.
