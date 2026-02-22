import { http } from './client'
import type { ApiResponse } from './client'

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface CreateCommentBody {
  content: string
  commentable_type: string
  commentable_id: string
  parent_id?: string
}

export interface UpdateCommentBody {
  content: string
}

export interface GetCommentsParams {
  commentable_type: string
  commentable_id: string
  page?: number
  limit?: number
}

export interface LikeCommentBody {
  type: 'like' | 'dislike'
}

// ---------------------------------------------------------------------------
// Endpoints
//
// The API schema does not define structured response bodies for comments,
// so all endpoints return ApiResponse<unknown>.
// ---------------------------------------------------------------------------

export function createComment(body: CreateCommentBody): Promise<ApiResponse<unknown>> {
  return http.post<unknown>('/comments', body)
}

export function getComments(params: GetCommentsParams): Promise<ApiResponse<unknown>> {
  return http.get<unknown>('/comments', params)
}

export function likeComment(id: string, body: LikeCommentBody): Promise<ApiResponse<unknown>> {
  return http.post<unknown>(`/comments/${id}/like`, body)
}

export function updateComment(id: string, body: UpdateCommentBody): Promise<ApiResponse<unknown>> {
  return http.put<unknown>(`/comments/${id}`, body)
}

export function deleteComment(id: string): Promise<ApiResponse<null>> {
  return http.delete<null>(`/comments/${id}`)
}
