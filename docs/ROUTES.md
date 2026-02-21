# Frontend Routes Specs

| Path | Componente pagina | Layout | Auth richiesta | Dati caricati |
|------|------------------|--------|----------------|---------------|
| /login | LoginPage | AuthLayout | No | - |
| /dashboard | OverviewPage | DashboardLayout | Sì | stats, charts |
| /dashboard/users | UsersPage | DashboardLayout | Sì | users paginati (TODO: mock dati, endpoint mancante) |
| /dashboard/companies | CompaniesPage | DashboardLayout | Sì | companies |
| /dashboard/jobs | JobsPage | DashboardLayout | Sì | jobs paginati |
| /dashboard/jobs/map | JobsMapPage | DashboardLayout | Sì | jobs con GPS |
| /dashboard/news | NewsPage | DashboardLayout | Sì | news paginati |
| /dashboard/analytics | AnalyticsPage | DashboardLayout | Sì | log aggregati (TODO: usare solo /admin/stats) |
| /dashboard/skills | SkillsPage | DashboardLayout | Sì | skills aggregate |
