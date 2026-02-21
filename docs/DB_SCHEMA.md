# Database Schema (MongoDB & Prisma)

Questo documento sintetizza le collezioni MongoDB presenti e lo strato ORM garantito da Prisma (`apps/backend/prisma/schema.prisma`).

## 1. Inventory

Basato sulle vere raccolte MongoDB presenti (`itjobhub`):
- `users`: Profili utente principali, autenticazione, ruolo.
- `user_profiles`: Dati arricchiti (cv, skills, preferences) per ogni user (`1:1`).
- `companies`: Aziende, salvano trust e link vari.
- `jobs`: Annunci di lavoro, collegati a companies e seniorities. Contengono un array di requisiti, skills, location (Point GeoJSON).
- `news`: Articoli formattati per categorie, contenenti array "translations".
- `seniorities`: Dizionario univoco di livelli di esperienza.
- `comments`: Risposte e thread degli utenti.
- `interactions`: Tracciamento su job/news (VIEW, APPLY, CLICK).
- `likes`: Tracciamento dei Mi Piace.
- `favorites`: Job salvati dall'utente.
- `refresh_tokens`: Gestione autenticazione.

## 2. Collezione "Jobs" e Geospatial

All'interno della collection `jobs`, le location sono modellate con un tipo condiviso:
```prisma
type LocationGeo {
  type        String  @default("Point")
  coordinates Float[]
}
```
Questo campo si chiama `location_geo`. Consente query MongoDB aggregate tramite API `$geoNear` o `find({ location_geo: { $geoWithin: ... } })`.
I filtri mappa dovranno inviare `lat` e `lng` e il backend lo cercherà lungo `location_geo.coordinates`.

## 3. Analytics e Metriche

L'API non dispone di una collection standalone 'analytics'; il traffico è tracciato via `interactions` (VIEW, APPLY) o tramite i row counts aggregati in runtime. 

Il backend espone `GET /admin/stats` che risolverà dinamicamente conteggi da `users` e `jobs`. Il frontend dovrà basarsi esclusivamente sulle property ritornate per i widget Overview.
