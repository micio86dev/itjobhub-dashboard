import { http } from './client'
import type { ApiResponse } from './client'
import type { Me, UserListItem, UserProfile } from './types'

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface UpdateProfileBody {
  firstName?: string
  lastName?: string
  phone?: string
  location?: string
  bio?: string
  birthDate?: string
  avatar?: string
  languages?: string[]
  skills?: string[]
  seniority?: string
  availability?: string
  workModes?: string[]
  cvUrl?: string
  github?: string
  linkedin?: string
  website?: string
}

export interface AddSkillBody {
  skill: string
}

export interface UsersPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface UsersListResponse {
  users: UserListItem[]
  pagination: UsersPagination
}

export interface GetUsersParams {
  page?: number
  limit?: number
  role?: string
  q?: string
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function getMe(): Promise<ApiResponse<Me>> {
  return http.get<Me>('/users/me')
}

export function getUsers(params?: GetUsersParams): Promise<ApiResponse<UsersListResponse>> {
  return http.get<UsersListResponse>('/users', params)
}

export function getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
  return http.get<UserProfile>(`/users/${userId}/profile`)
}

export function updateMyProfile(body: UpdateProfileBody): Promise<ApiResponse<Me>> {
  return http.put<Me>('/users/me', body)
}

export function addSkill(body: AddSkillBody): Promise<ApiResponse<Me>> {
  return http.post<Me>('/users/me/skills', body)
}
