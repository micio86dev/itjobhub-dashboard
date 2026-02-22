# API Reference — Admin Dashboard

Documentazione degli endpoint REST disponibili dal backend BunJS.

> **Base URL**: `http://localhost:3001` (development) | `https://api.devboards.io` (production)
>
> **Auth**: Token JWT in header `Authorization: Bearer <token>`

---

## 📋 Tabella Riepilogativa

| Metodo     | Path                                  | Auth               | Request                                                  | Response                      | Scopo                           |
| ---------- | ------------------------------------- | ------------------ | -------------------------------------------------------- | ----------------------------- | ------------------------------- |
| **POST**   | `/auth/register`                      | No                 | email, password, firstName, lastName                     | { user, token, refreshToken } | Registrazione nuovo utente      |
| **POST**   | `/auth/login`                         | No                 | email, password                                          | { user, token, refreshToken } | Login utente                    |
| **POST**   | `/auth/logout`                        | Sì                 | -                                                        | { success }                   | Logout e invalidazione token    |
| **POST**   | `/auth/refresh`                       | No (cookie)        | -                                                        | { token }                     | Rinnovamento JWT token          |
| **POST**   | `/auth/forgot-password`               | No                 | email                                                    | { success, message }          | Richiesta reset password        |
| **POST**   | `/auth/reset-password`                | No                 | token, password                                          | { success }                   | Reset password confermato       |
| **GET**    | `/auth/user`                          | Sì                 | -                                                        | User                          | Recupera dati utente corrente   |
| **GET**    | `/auth/oauth/:provider/authorize`     | No                 | -                                                        | { url }                       | Ottieni URL provider OAuth      |
| **POST**   | `/auth/oauth/:provider/callback`      | No                 | code, state                                              | { user, token }               | Callback OAuth                  |
| **GET**    | `/admin/stats`                        | Sì (admin)         | month?, year?                                            | AdminStats                    | Statistiche generali            |
| **GET**    | `/admin/stats/registrations-timeline` | Sì (admin)         | days?                                                    | Timeline[]                    | Timeline registrazioni          |
| **GET**    | `/admin/stats/jobs-timeline`          | Sì (admin)         | weeks?                                                   | Timeline[]                    | Timeline jobs creati            |
| **GET**    | `/admin/stats/login-methods`          | Sì (admin)         | -                                                        | LoginMethodDist[]             | Distribuzione metodi login      |
| **GET**    | `/admin/stats/top-languages`          | Sì (admin)         | limit?                                                   | Language[]                    | Lingue più richieste            |
| **GET**    | `/jobs`                               | No                 | page?, limit?, skills?, type?, level?, company?, search? | PaginatedResponse<Job>        | Lista jobs with filters         |
| **GET**    | `/jobs/stats/skills`                  | No                 | -                                                        | TopSkill[]                    | Top 30 skill aggregate          |
| **GET**    | `/jobs/:id`                           | No                 | -                                                        | Job                           | Dettaglio job singolo           |
| **POST**   | `/jobs`                               | Sì (company/admin) | job data                                                 | Job                           | Crea nuovo job                  |
| **PUT**    | `/jobs/:id`                           | Sì (owner/admin)   | job data                                                 | Job                           | Aggiorna job                    |
| **DELETE** | `/jobs/:id`                           | Sì (owner/admin)   | -                                                        | { success }                   | Elimina job                     |
| **GET**    | `/jobs/:id/interactions`              | No                 | type?                                                    | Interaction[]                 | Visualizzazioni/candidature job |
| **POST**   | `/interactions`                       | No                 | trackable_id, type, fingerprint?                         | Interaction                   | Traccia view/click/apply        |
| **GET**    | `/companies`                          | No                 | page?, limit?, search?, industry?, verified?             | PaginatedResponse<Company>    | Lista companies                 |
| **GET**    | `/companies/:id`                      | No                 | -                                                        | Company                       | Dettaglio company               |
| **POST**   | `/companies`                          | Sì (admin)         | name, description, website                               | Company                       | Crea company                    |
| **PUT**    | `/companies/:id`                      | Sì (admin)         | company data                                             | Company                       | Aggiorna company                |
| **GET**    | `/news`                               | No                 | page?, limit?, category?, search?, language?             | PaginatedResponse<News>       | Lista news                      |
| **GET**    | `/news/:id`                           | No                 | -                                                        | News                          | Dettaglio news                  |
| **POST**   | `/news`                               | Sì (admin)         | title, content, category                                 | News                          | Crea news                       |
| **GET**    | `/users/:id`                          | Sì (admin)         | -                                                        | UserProfile                   | Profilo utente                  |
| **PUT**    | `/users/:id`                          | Sì (owner/admin)   | user data                                                | User                          | Aggiorna profilo                |
| **GET**    | `/comments/:id`                       | No                 | -                                                        | Comment                       | Dettaglio commento              |
| **POST**   | `/comments`                           | Sì                 | content, commentable_id, commentable_type                | Comment                       | Crea commento                   |

---

## 🔐 Authentication

### Login

```
POST /auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { id, email, first_name, last_name, role, ... },
    "token": "eyJhbGc...", // JWT to send in Authorization header
    "refreshToken": "..." // for refresh in /auth/refresh
  },
  "message": "Login successful"
}
```

### Register

```
POST /auth/register
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response 201:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "..."
  }
}
```

---

## 📊 Admin Endpoints

### Overview Stats

```
GET /admin/stats?month=2&year=2026
Response:
{
  "success": true,
  "data": {
    "users": 234,
    "jobs": 567,
    "companies": 12,
    "news": 45,
    "usersChange": 5,  // % change vs previous month
    "jobsChange": -2
  }
}
```

### Stats Timeline

```
GET /admin/stats/registrations-timeline?days=30
Response:
{
  "success": true,
  "data": [
    { "date": "2026-02-01", "count": 5 },
    { "date": "2026-02-02", "count": 8 },
    ...
  ]
}
```

---

## 🔍 Jobs & Search

### List Jobs with Filters

```
GET /jobs?page=1&limit=25&skills=JavaScript,React&type=FULL_TIME&company=xxx

Query params:
  - page: numero pagina (default 1)
  - limit: risultati per pagina (default 25)
  - skills: comma-separated skill names
  - type: FULL_TIME | PART_TIME | CONTRACT
  - contractType: PERMANENT | TEMPORARY | PROJECT
  - level: JUNIOR | SENIOR | LEAD
  - company: company ID
  - search: ricerca libera nel titolo/descrizione
  - language: lingua richiesta
  - remote: true | false

Response:
{
  "success": true,
  "data": {
    "data": [ Job[], ... ],
    "total": 1234,
    "page": 1,
    "limit": 25,
    "totalPages": 50
  }
}
```

### Top Skills

```
GET /jobs/stats/skills
Response:
{
  "success": true,
  "data": [
    { "skill": "JavaScript", "count": 450 },
    { "skill": "React", "count": 380 },
    ...
  ]
}
```

---

## 📰 Companies & News

### List Companies

```
GET /companies?page=1&limit=25&industry=Technology&verified=true
Response:
{
  "success": true,
  "data": {
    "data": [ Company[], ... ],
    "total": 50,
    "page": 1,
    "limit": 25,
    "totalPages": 2
  }
}
```

### List News

```
GET /news?page=1&limit=25&category=AI&language=it
Response:
{
  "success": true,
  "data": {
    "data": [ News[], ... ],
    "total": 120,
    "page": 1
  }
}
```

---

## 📝 Notes

- **Endpoint Mancanti**:
  - `GET /users` (non esiste, users vengono recuperati singolarmente via `/users/:id`)
  - `GET /users/:id/jobs` (numero jobs per utente non disponibile)
- **GeoJSON**: Campo `location_geo` nei Job usa formato GeoJSON Point: `{ type: "Point", coordinates: [lng, lat] }`

- **Paginazione**: Seguire sempre lo schema `{ data: [], total: number, page: number, limit: number, totalPages: number }`

- **Rate Limiting**: Non documentato, verificare con backend team

- **Errori**: Risposta standard errore: `{ success: false, status: 400, message: "..." }`
