import { http } from './client'
import type { ApiResponse } from './client'
import type { FavoriteJob, FavoriteWithJob } from './types'

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface AddFavoriteBody {
  job_id: string
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function getFavorites(): Promise<ApiResponse<FavoriteWithJob[]>> {
  return http.get<FavoriteWithJob[]>('/favorites')
}

export function addFavorite(body: AddFavoriteBody): Promise<ApiResponse<FavoriteJob>> {
  return http.post<FavoriteJob>('/favorites', body)
}

export function removeFavorite(jobId: string): Promise<ApiResponse<null>> {
  return http.delete<null>(`/favorites/${jobId}`)
}
