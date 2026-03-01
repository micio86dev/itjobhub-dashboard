import { http } from './client'
import type { ApiResponse } from './client'
import type { HasLiked, Like, LikesCount } from './types'

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface AddLikeBody {
  likeable_type: string
  likeable_id: string
  type: 'like' | 'dislike'
}

export interface RemoveLikeParams {
  likeable_type: string
  likeable_id: string
}

export interface LikesCountParams {
  likeable_type: string
  likeable_id: string
}

export interface HasLikedParams {
  likeable_type: string
  likeable_id: string
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function addLike(body: AddLikeBody): Promise<ApiResponse<Like>> {
  return http.post<Like>('/likes', body)
}

export function removeLike(params: RemoveLikeParams): Promise<ApiResponse<null>> {
  return http.delete<null>('/likes', params)
}

export function getLikesCount(params: LikesCountParams): Promise<ApiResponse<LikesCount>> {
  return http.get<LikesCount>('/likes/count', params)
}

export function hasLiked(params: HasLikedParams): Promise<ApiResponse<HasLiked>> {
  return http.get<HasLiked>('/likes/check', params)
}
