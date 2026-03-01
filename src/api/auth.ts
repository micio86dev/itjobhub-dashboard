import { http } from './client'
import type { ApiResponse } from './client'
import type { AuthUser } from './types'

// ---------------------------------------------------------------------------
// Request / Response shapes
// ---------------------------------------------------------------------------

export interface RegisterBody {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface ForgotPasswordBody {
  email: string
}

export interface ResetPasswordBody {
  token: string
  password: string
}

export interface AuthTokens {
  token: string
  refreshToken?: string
}

export interface LoginResponse {
  user: AuthUser
  token: string
}

export interface RefreshResponse {
  token: string
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function register(body: RegisterBody): Promise<ApiResponse<AuthUser>> {
  return http.post<AuthUser>('/auth/register', body)
}

export function login(body: LoginBody): Promise<ApiResponse<LoginResponse>> {
  return http.post<LoginResponse>('/auth/login', body)
}

export function refresh(): Promise<ApiResponse<RefreshResponse>> {
  return http.post<RefreshResponse>('/auth/refresh')
}

export function logout(): Promise<ApiResponse<null>> {
  return http.post<null>('/auth/logout')
}

export function forgotPassword(body: ForgotPasswordBody): Promise<ApiResponse<null>> {
  return http.post<null>('/auth/forgot-password', body)
}

export function resetPassword(body: ResetPasswordBody): Promise<ApiResponse<null>> {
  return http.post<null>('/auth/reset-password', body)
}

export interface OAuthCallbackParams {
  provider: string
  code: string
  state?: string
}

export function oauthCallback(params: OAuthCallbackParams): Promise<ApiResponse<LoginResponse>> {
  return http.get<LoginResponse>(`/auth/oauth/${params.provider}/callback`, {
    code: params.code,
    state: params.state,
  })
}

export function getOauthUrl(provider: string): Promise<ApiResponse<{ url: string }>> {
  return http.get<{ url: string }>(`/auth/oauth/${provider}`)
}
