import { companiesApi } from '@/api'
import type { Company } from '@/api'

export interface GetCompaniesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedCompanies {
  items: Company[]
  total: number
  page: number
  pages: number
}

async function getCompanies(params: GetCompaniesParams = {}): Promise<PaginatedCompanies> {
  const res = await companiesApi.getCompanies(params)
  const { companies, pagination } = res.data
  return {
    items: companies,
    total: pagination.total,
    page: pagination.page,
    pages: pagination.pages,
  }
}

async function getCompany(id: string): Promise<Company> {
  const res = await companiesApi.getCompany(id)
  return res.data
}

export const companiesService = { getCompanies, getCompany }
