import { http } from './client'
import type { ApiResponse } from './client'

// ---------------------------------------------------------------------------
// Response shapes
//
// Admin endpoints do not define structured response schemas in the OpenAPI
// spec, so all return ApiResponse<unknown>.
// ---------------------------------------------------------------------------

export interface RegistrationsTimelineParams {
  days?: number
}

export interface JobsTimelineParams {
  weeks?: number
}

export interface StatsParams {
  month?: number
  year?: number
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function getStats(params?: StatsParams): Promise<ApiResponse<unknown>> {
  return http.get<unknown>('/admin/stats', params)
}

export function getRegistrationsTimeline(params?: RegistrationsTimelineParams): Promise<ApiResponse<unknown>> {
  return http.get<unknown>('/admin/stats/registrations-timeline', params)
}

export function getJobsTimeline(params?: JobsTimelineParams): Promise<ApiResponse<unknown>> {
  return http.get<unknown>('/admin/stats/jobs-timeline', params)
}

export function getLoginMethods(): Promise<ApiResponse<unknown>> {
  return http.get<unknown>('/admin/stats/login-methods')
}

export function getTopLanguages(params?: { limit?: number }): Promise<ApiResponse<unknown>> {
  return http.get<unknown>('/admin/stats/top-languages', params)
}
