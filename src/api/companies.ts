import { http } from './client'
import type { ApiResponse } from './client'
import type { Company, Pagination } from './types'

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface GetCompaniesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateCompanyBody {
  name: string
  description?: string
  logo?: string
  website?: string
}

export type UpdateCompanyBody = Partial<CreateCompanyBody>

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

export interface CompaniesListResponse {
  companies: Company[]
  pagination: Pagination
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function getCompanies(
  params?: GetCompaniesParams,
): Promise<ApiResponse<CompaniesListResponse>> {
  return http.get<CompaniesListResponse>('/companies', params)
}

export function getCompany(id: string): Promise<ApiResponse<Company>> {
  return http.get<Company>(`/companies/${id}`)
}

export function createCompany(body: CreateCompanyBody): Promise<ApiResponse<Company>> {
  return http.post<Company>('/companies', body)
}

export function updateCompany(id: string, body: UpdateCompanyBody): Promise<ApiResponse<Company>> {
  return http.put<Company>(`/companies/${id}`, body)
}

export function deleteCompany(id: string): Promise<ApiResponse<null>> {
  return http.delete<null>(`/companies/${id}`)
}
