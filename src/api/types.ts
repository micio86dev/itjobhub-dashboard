// ---------------------------------------------------------------------------
// Shared / primitive
// ---------------------------------------------------------------------------

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface GeoPoint {
  type: string
  coordinates: number[]
}

// ---------------------------------------------------------------------------
// Auth / Users
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
  profileCompleted: boolean
  phone?: string | null
  location?: string | null
  bio?: string | null
  birthDate?: string | null
  avatar?: string | null
  languages?: string[]
  skills?: string[]
  seniority?: string | null
  availability?: string | null
  location_geo?: GeoPoint | null
}

export interface UserProfile {
  id: string
  userId: string
  languages: string[]
  skills: string[]
  seniority?: string | null
  availability?: string | null
  workModes: string[]
  cvUrl?: string | null
  bio?: string | null
  github?: string | null
  linkedin?: string | null
  website?: string | null
  createdAt: string
  updatedAt: string
}

export interface Me extends AuthUser {
  profile?: UserProfile | null
}

export interface UserListItem {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  phone: string | null
  location: string | null
  createdAt: unknown
  profileCompleted: boolean
}

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

export interface Company {
  id: string
  name: string
  description: string | null
  logo: string | null
  website: string | null
  trustScore?: number | null
  totalRatings?: number | null
  totalLikes?: number | null
  totalDislikes?: number | null
  created_at: string | null
  updated_at: string | null
}

export interface CompanySummary {
  id: string
  name: string
  logo?: string | null
  logo_url?: string | null
  trustScore?: number | null
  totalRatings?: number | null
  totalLikes?: number | null
  totalDislikes?: number | null
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export interface JobListItem {
  id: string
  title: string
  description: string | null
  location: string | null
  location_geo: GeoPoint | null
  workMode: string | null
  contractType: string | null
  seniority: string | null
  skills: string[]
  salary_min: number | null
  salary_max: number | null
  currency: string | null
  source_url: string | null
  source: string | null
  status: string | null
  company: CompanySummary | null
  created_at: string | null
  updated_at: string | null
  likes: number
  dislikes: number
  user_reaction: string | null
  is_favorite?: boolean
}

export interface Job {
  id: string
  title: string
  description: string | null
  location: string | null
  location_geo: GeoPoint | null
  workMode: string | null
  contractType: string | null
  seniority: string | null
  skills: string[]
  availability: string | null
  salary_min: number | null
  salary_max: number | null
  currency: string | null
  source_url: string | null
  source: string | null
  status: string | null
  company: Company | null
  created_at: string | null
  updated_at: string | null
  likes: number
  dislikes: number
  user_reaction: string | null
  is_favorite: boolean
}

export interface JobWrite {
  id: string
  title: string
  description: string | null
  location: string | null
  location_geo: GeoPoint | null
  workMode: string | null
  contractType: string | null
  seniority: string | null
  skills: string[]
  availability: string | null
  salary_min: number | null
  salary_max: number | null
  currency: string | null
  source_url: string | null
  source: string | null
  status: string | null
  companyId: string | null
  created_at: string | null
  updated_at: string | null
}

export type MatchLabel = 'excellent' | 'good' | 'fair' | 'low'

export interface JobMatchResult {
  score: number
  factors: {
    skillsMatch: number
    seniorityMatch: number
    locationMatch: number
    trustScore: number
    timeliness: number
    competition: number
    applicationRate: number
  }
  details: {
    matchedSkills: string[]
    missingSkills: string[]
    seniorityGap: string
    locationStatus: string
  }
}

export interface BatchMatchResult {
  [jobId: string]: { score: number; label: MatchLabel }
}

export interface JobBatchImportResult {
  successful: unknown[]
  failed: unknown[]
  companiesCreated: number
  summary: {
    totalJobs: number
    successfulJobs: number
    failedJobs: number
    companiesCreated: number
  }
}

export interface SkillStat {
  skill: string
  count: number
}

// ---------------------------------------------------------------------------
// Likes
// ---------------------------------------------------------------------------

export interface Like {
  id: string
  user_id: string
  likeable_type: string
  likeable_id: string
  type: string
  created_at: string | null
}

export interface LikesCount {
  likes: number
  dislikes: number
}

export interface HasLiked {
  hasLiked: boolean
  type: string | null
}

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------

export interface FavoriteJob {
  id: string
  user_id: string
  job_id: string
  created_at: string | null
}

export interface FavoriteWithJob extends FavoriteJob {
  job: JobListItem
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface NewsTranslation {
  language: string
  title: string
  summary: string | null
  content: string | null
}

export interface NewsItem {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string | null
  source_url: string | null
  image_url: string | null
  category: string | null
  language: string | null
  translations: NewsTranslation[]
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  likes: number
  dislikes: number
  comments_count: number
  user_reaction: string | null
}

export interface NewsStub {
  id: string
  title: string
  slug: string
}
