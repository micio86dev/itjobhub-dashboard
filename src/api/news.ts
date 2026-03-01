import { http } from './client'
import type { ApiResponse } from './client'
import type { NewsItem, NewsStub, Pagination } from './types'

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface GetNewsListParams {
  page?: number
  limit?: number
  category?: string
  language?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateNewsBody {
  title: string
  slug?: string
  summary?: string
  content?: string
  source_url?: string
  image_url?: string
  category?: string
  language?: string
  published_at?: string
}

export interface ImportNewsBody {
  url: string
  language?: string
}

export interface TrackNewsBody {
  event: string
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

export interface NewsListResponse {
  news: NewsItem[]
  pagination: Pagination
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function getNewsList(params?: GetNewsListParams): Promise<ApiResponse<NewsListResponse>> {
  return http.get<NewsListResponse>('/news', params)
}

export function getNews(idOrSlug: string): Promise<ApiResponse<NewsItem>> {
  return http.get<NewsItem>(`/news/${idOrSlug}`)
}

export function createNews(body: CreateNewsBody): Promise<ApiResponse<NewsItem>> {
  return http.post<NewsItem>('/news', body)
}

export function importNews(body: ImportNewsBody): Promise<ApiResponse<NewsStub>> {
  return http.post<NewsStub>('/news/import', body)
}

export function deleteNews(id: string): Promise<ApiResponse<null>> {
  return http.delete<null>(`/news/${id}`)
}

export function trackNews(id: string, body: TrackNewsBody): Promise<ApiResponse<null>> {
  return http.post<null>(`/news/${id}/track`, body)
}
