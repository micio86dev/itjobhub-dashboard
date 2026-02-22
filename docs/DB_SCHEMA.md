# Database Schema — MongoDB Collections

Documentazione delle collezioni MongoDB con struttura e relazioni.

---

## 📊 Schema Visuale

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                   │
├──────────────────┬─────────────────────────────────────────────├
│ id (ObjectId)    │ _id                                         │
│ email            │ unique, string                              │
│ password         │ optional, hash                              │
│ first_name       │ string                                      │
│ last_name        │ string                                      │
│ role             │ "user" | "company" | "admin" (default user)│
│ oauth_provider   │ optional: "github" | "linkedin" | "google" │
│ oauth_id         │ optional, per provider                      │
│ phone, location  │ optional                                    │
│ avatar, bio      │ optional                                    │
│ created_at       │ DateTime (default: now)                     │
│ updated_at       │ DateTime                                    │
└─────────────────────────────────────────────────────────────────┘
       │
       ├──→ ONE user_profiles
       ├──→ MANY comments
       ├──→ MANY likes
       ├──→ MANY favorites
       ├──→ MANY interactions
       └──→ MANY refresh_tokens

┌──────────────────────────────────────────────────────┐
│              USER_PROFILES                           │
├───────────────────────────────────────────┬──────────┤
│ id                         │ _id           │          │
│ user_id (unique, ref User) │ ObjectId      │ FK       │
│ languages                  │ String[]      │          │
│ skills                     │ String[]      │          │
│ seniority                  │ optional      │          │
│ workModes                  │ String[]      │          │
│ cv_url, github, linkedin   │ optional URLs │          │
│ location                   │ optional      │          │
│ location_geo               │ GeoJSON Point │          │
│ created_at, updated_at     │ DateTime      │          │
└──────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        COMPANIES                                │
├──────────────────┬─────────────────────────────────────────────├
│ id               │ _id                                         │
│ name             │ unique, string                              │
│ description      │ optional                                    │
│ website          │ optional URL                                │
│ industry         │ optional                                    │
│ size             │ optional: "1-10" | "10-50" | "50-200" | ... │
│ location         │ optional                                    │
│ logo, logo_url   │ optional                                    │
│ trustScore       │ float (0-100, default 80)                   │
│ totalRatings     │ int (default 0)                             │
│ totalLikes       │ int (default 0)                             │
│ totalDislikes    │ int (default 0)                             │
│ created_at       │ DateTime                                    │
└─────────────────────────────────────────────────────────────────┘
       │
       └──→ MANY jobs

┌──────────────────────────────────────────────────────┐
│                  JOBS                                │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ company_id (FK)  │ ref Company (optional)             │
│ seniority_id     │ ref Seniority (optional)           │
│ title            │ string                             │
│ description      │ string (HTML o markdown)           │
│ link             │ optional URL to original           │
│ source           │ e.g., "linkedin", "indeed", ...   │
│ original_lang    │ e.g., "it", "en"                  │
│ language         │ final language (after translation) │
│ published_at     │ DateTime                           │
│                  │                                   │
│ requirements[]   │ String[]                           │
│ benefits[]       │ String[]                           │
│ salary_min, max  │ optional numeric                   │
│                  │                                   │
│ location         │ string (e.g., "Milano, IT")       │
│ remote           │ boolean (default false)            │
│ formatted_addr   │ geocoded address string            │
│ city, country    │ extracted from geo                │
│ location_geo     │ **GeoJSON Point**:                 │
│                  │ { type: "Point",                  │
│                  │   coordinates: [lng, lat] }       │
│                  │                                   │
│ employment_type  │ e.g., "FULL_TIME"                │
│ experience_level │ e.g., "SENIOR"                    │
│ seniority        │ e.g., "Lead", "Junior"            │
│ skills[]         │ String[] (tags)                   │
│ views_count      │ int (default 0)                   │
│ status           │ "active" | "expired" | "draft"    │
│ created_at       │ DateTime                          │
│ expires_at       │ optional DateTime                  │
└──────────────────────────────────────────────────────┘
       │
       ├──→ MANY favorites (users interested)
       └──→ MANY interactions (views, applys)

┌──────────────────────────────────────────────────────┐
│                   NEWS                               │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ title            │ string                            │
│ slug             │ unique URL slug                   │
│ summary          │ optional brief                    │
│ content          │ optional full content (HTML)      │
│ source_url       │ optional original source          │
│ image_url        │ optional cover image              │
│ category         │ e.g., "AI", "Security", "Tech"   │
│ language         │ original language code            │
│ translations[]   │ NewsTranslation[]                 │
│                  │ { language, title, summary,       │
│                  │   content }                       │
│ is_published     │ boolean (default true)            │
│ published_at     │ DateTime (default now)            │
│ views_count      │ int (default 0)                   │
│ clicks_count     │ int (default 0)                   │
│ created_at       │ DateTime                          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                 COMMENTS                             │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ commentable_id   │ ObjectId (job, news, etc)         │
│ commentable_type │ "job" | "news"                    │
│ user_id (FK)     │ ref User                          │
│ content          │ string (comment text)             │
│ parentId         │ optional, for nested replies      │
│ created_at       │ DateTime                          │
│ updated_at       │ DateTime                          │
└──────────────────────────────────────────────────────┘
       │
       └──→ MANY comments (nested replies via parentId)

┌──────────────────────────────────────────────────────┐
│                  LIKES                               │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ user_id (FK)     │ ref User                          │
│ likeable_type    │ "job" | "news" | "comment"        │
│ likeable_id      │ ObjectId (target resource)        │
│ type             │ "LIKE" | "DISLIKE"                │
│ created_at       │ DateTime                          │
│ unique           │ (user_id, likeable_type,          │
│                  │  likeable_id) → 1 per user        │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              INTERACTIONS                            │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ trackable_id     │ ObjectId (job, news, etc)         │
│ trackable_type   │ "job" | "news"                    │
│ user_id          │ optional (ref User)               │
│ fingerprint      │ optional device fingerprint       │
│ type             │ "VIEW" | "APPLY" | "CLICK"        │
│ created_at       │ DateTime                          │
│ unique           │ (trackable_id, type, user_id,     │
│                  │  fingerprint) — no duplicate      │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│            REFRESH_TOKENS                            │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ refresh_token    │ unique JWT refresh token          │
│ user_id (FK)     │ ref User                          │
│ expires_at       │ DateTime expiration               │
│ created_at       │ DateTime                          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│             FAVORITES                                │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ user_id (FK)     │ ref User                          │
│ job_id (FK)      │ ref Job                           │
│ created_at       │ DateTime                          │
│ unique           │ (user_id, job_id)                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│            SENIORITIES                               │
├──────────────────┬───────────────────────────────────┤
│ id               │ _id                               │
│ level            │ unique string (e.g., "Junior")    │
│ created_at       │ DateTime                          │
└──────────────────────────────────────────────────────┘
```

---

## 🔑 Indexes

- **users**: `{ email: 1 }` (unique), `{ oauth_provider: 1, oauth_id: 1 }`
- **user_profiles**: `{ user_id: 1 }` (unique)
- **companies**: none documented
- **jobs**: `{ company_id: 1 }`, `{ location_geo: "2dsphere" }` (for geospatial queries)
- **news**: `{ slug: 1 }` (unique)
- **comments**: `{ commentable_id: 1, commentable_type: 1 }`
- **likes**: unique constraint on `(user_id, likeable_type, likeable_id)`
- **interactions**: unique constraint on `(trackable_id, trackable_type, user_id, fingerprint, type)`

---

## 🌍 GeoJSON Format

Nel campo `location_geo` dei jobs (e user_profiles):

```json
{
  "type": "Point",
  "coordinates": [9.19, 45.4642] // [longitude, latitude]
}
```

**Importante**: MongoDB aspetta `[lng, lat]`, non `[lat, lng]`.

---

## 📈 Analytics & Tracking

### ✓ Collection `interactions`

Traccia views, clicks, applications:

- `type: "VIEW"` — utente ha visto il job
- `type: "CLICK"` — utente ha cliccato il link esterno
- `type: "APPLY"` — utente ha candidato (registrato o pubblico)

Query per analytics:

```javascript
// Views per job in periodo
db.interactions.find({
  trackable_type: "job",
  trackable_id: ObjectId(...),
  type: "VIEW",
  created_at: { $gte: ISODate("2026-01-01") }
})

// Top searches
db.interactions
  .aggregate([
    { $match: { trackable_type: "news", type: "CLICK" } },
    { $group: { _id: "$trackable_id", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ])
```

---

## ✅ Data Validation Rules

- **Email**: valid email format, unique per utente
- **Password**: minimo 6 caratteri (hash bcrypt o similar)
- **Role**: enum `["user", "company", "admin"]`
- **Lingua**: ISO 639-1 codes: "it", "en", "es", "de", "fr"
- **Coordinates**: [longitude, latitude] in range [-180, 180] x [-90, 90]
- **Dates**: ISO 8601 format (DateTime in Prisma)
