// Core client utilities
export { setToken, getToken, ApiError } from './client'
export type { ApiResponse } from './client'

// Shared types
export type {
  Pagination,
  GeoPoint,
  AuthUser,
  UserProfile,
  Me,
  UserListItem,
  Company,
  CompanySummary,
  JobListItem,
  Job,
  JobWrite,
  MatchLabel,
  JobMatchResult,
  BatchMatchResult,
  JobBatchImportResult,
  SkillStat,
  Like,
  LikesCount,
  HasLiked,
  FavoriteJob,
  FavoriteWithJob,
  NewsTranslation,
  NewsItem,
  NewsStub,
} from './types'

// Endpoint modules — exported as namespaces for clarity at call sites:
//   import { authApi, jobsApi } from '@/api'
//   authApi.login({ email, password })

import * as authApi from './auth'
import * as usersApi from './users'
import * as jobsApi from './jobs'
import * as companiesApi from './companies'
import * as commentsApi from './comments'
import * as likesApi from './likes'
import * as favoritesApi from './favorites'
import * as newsApi from './news'
import * as adminApi from './admin'

export {
  authApi,
  usersApi,
  jobsApi,
  companiesApi,
  commentsApi,
  likesApi,
  favoritesApi,
  newsApi,
  adminApi,
}
