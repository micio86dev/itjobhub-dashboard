# API Reference

This document maps all the endpoints available in the backend API (running on port 3001), based on its Swagger definition.

| Method | Path | Auth | Request body | Response shape | Purpose |
|--------|------|------|-------------|----------------|-------|
| `POST` | `/auth/register` | No | Yes | `User` + Tokens | User registration |
| `POST` | `/auth/login` | No | Yes | `User` + Tokens | User login via credentials |
| `POST` | `/auth/refresh` | No | No | Access Token | Token refresh |
| `POST` | `/auth/logout` | Sì | No | Success Msg | User logout |
| `POST` | `/auth/forgot-password` | No | Yes | Success Msg | Send reset generic email |
| `POST` | `/auth/reset-password` | No | Yes | Success Msg | Reset password with token |
| `GET` | `/users/me` | Sì | No | `User` | Get current logged-in user |
| `GET` | `/users/{id}/profile` | No | No | `UserProfile` | Get public profile of a user |
| `PUT` | `/users/me/profile` | Sì | Yes | `UserProfile` | Update current user profile |
| `GET` | `/jobs/` | No | No | `PaginatedResponse<Job>` | List and filter jobs |
| `GET` | `/jobs/{id}` | No | No | `Job` | Get a single job by ID |
| `PUT` | `/jobs/{id}` | Sì | Yes | `Job` | Update an existing job |
| `DELETE` | `/jobs/{id}` | Sì | No | Success Msg | Delete a job |
| `GET` | `/companies/` | No | No | `PaginatedResponse<Company>` | List companies |
| `GET` | `/companies/{id}` | No | No | `Company` | Get single company by ID |
| `PUT` | `/companies/{id}` | Sì | Yes | `Company` | Update company info |
| `GET` | `/news/` | No | No | `PaginatedResponse<News>` | List news articles |
| `GET` | `/news/{id}` | No | No | `News` | Get a single news article |
| `DELETE` | `/news/{id}` | Sì | No | Success Msg | Delete a news article |
| `GET` | `/admin/stats` | Sì | No | `AnalyticsOverview` | Retrieve general stats for dashboard |
| `GET` | `/jobs/stats/skills` | No | No | `SearchLog[]` | Retrieve most requested skills |

> **Nota:** Gli endpoint `GET /users/` e simili previsti per le liste paginate non sono stati trovati nello Swagger generato. Mockeremo queste chiamate lato frontend (o potremmo usare estensioni backend in futuro).
