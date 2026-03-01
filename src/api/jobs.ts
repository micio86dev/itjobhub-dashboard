import { http } from './client'
import type { ApiResponse } from './client'
import type {
  BatchMatchResult,
  Job,
  JobBatchImportResult,
  JobListItem,
  JobMatchResult,
  JobWrite,
  Pagination,
  SkillStat,
} from './types'

// ---------------------------------------------------------------------------
// Request shapes
// ---------------------------------------------------------------------------

export interface GetJobsParams {
  page?: number
  limit?: number
  search?: string
  location?: string
  workMode?: string
  contractType?: string
  seniority?: string
  skills?: string | string[]
  languages?: string | string[]
  status?: string
  companyId?: string
  source?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateJobBody {
  title: string
  description?: string
  location?: string
  workMode?: string
  contractType?: string
  seniority?: string
  skills?: string[]
  availability?: string
  salary_min?: number
  salary_max?: number
  currency?: string
  source_url?: string
  source?: string
  status?: string
  companyId?: string
}

export type UpdateJobBody = Partial<CreateJobBody>

export interface ImportJobBody {
  url: string
}

export interface ImportJobBatchBody {
  jobs: CreateJobBody[]
}

export interface TrackJobBody {
  event: string
  [key: string]: unknown
}

export interface GetJobsBatchMatchParams {
  jobIds: string[]
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

export interface JobsListResponse {
  jobs: JobListItem[]
  pagination: Pagination
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export function getJobs(params?: GetJobsParams): Promise<ApiResponse<JobsListResponse>> {
  return http.get<JobsListResponse>('/jobs', params)
}

export function getJob(id: string): Promise<ApiResponse<Job>> {
  return http.get<Job>(`/jobs/${id}`)
}

export function createJob(body: CreateJobBody): Promise<ApiResponse<JobWrite>> {
  return http.post<JobWrite>('/jobs', body)
}

export function updateJob(id: string, body: UpdateJobBody): Promise<ApiResponse<JobWrite>> {
  return http.put<JobWrite>(`/jobs/${id}`, body)
}

export function deleteJob(id: string): Promise<ApiResponse<null>> {
  return http.delete<null>(`/jobs/${id}`)
}

export function importJob(body: ImportJobBody): Promise<ApiResponse<JobWrite>> {
  return http.post<JobWrite>('/jobs/import', body)
}

export function importJobBatch(
  body: ImportJobBatchBody,
): Promise<ApiResponse<JobBatchImportResult>> {
  return http.post<JobBatchImportResult>('/jobs/import/batch', body)
}

export function trackJob(id: string, body: TrackJobBody): Promise<ApiResponse<null>> {
  return http.post<null>(`/jobs/${id}/track`, body)
}

export function getJobMatch(id: string): Promise<ApiResponse<JobMatchResult>> {
  return http.get<JobMatchResult>(`/jobs/${id}/match`)
}

export function getJobsBatchMatch(
  params: GetJobsBatchMatchParams,
): Promise<ApiResponse<BatchMatchResult>> {
  return http.get<BatchMatchResult>('/jobs/match/batch', {
    jobIds: params.jobIds,
  })
}

export function getSkillsStats(): Promise<ApiResponse<SkillStat[]>> {
  return http.get<SkillStat[]>('/jobs/stats/skills')
}
