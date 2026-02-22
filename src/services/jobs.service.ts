import { jobsApi } from '@/api'
import type { JobListItem, Job } from '@/api'
import type { GetJobsParams } from '@/api/jobs'

export interface PaginatedJobs {
  items: JobListItem[]
  total: number
  page: number
  pages: number
}

async function getJobs(params: GetJobsParams = {}): Promise<PaginatedJobs> {
  const res = await jobsApi.getJobs(params)
  const { jobs, pagination } = res.data
  return {
    items: jobs,
    total: pagination.total,
    page: pagination.page,
    pages: pagination.pages,
  }
}

async function getJob(id: string): Promise<Job> {
  const res = await jobsApi.getJob(id)
  return res.data
}

async function getJobsWithLocation(limit = 500): Promise<JobListItem[]> {
  const res = await jobsApi.getJobs({ limit, status: 'active' })
  return res.data.jobs.filter((j) => j.location_geo !== null)
}

async function deleteJob(id: string): Promise<void> {
  await jobsApi.deleteJob(id)
}

export const jobsService = { getJobs, getJob, getJobsWithLocation, deleteJob }
