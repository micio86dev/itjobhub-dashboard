import { describe, it, expect, vi, afterEach } from 'vitest'
import { jobsService } from '../jobs.service'
import * as api from '@/api'
import type { ApiResponse } from '@/api'
import type { JobsListResponse } from '@/api/jobs'
import type { JobListItem, GeoPoint } from '@/api'

const makeJob = (overrides: Partial<JobListItem> = {}): JobListItem => ({
  id: 'job-1',
  title: 'Software Engineer',
  workMode: 'remote',
  contractType: 'full-time',
  seniority: 'mid',
  status: 'active',
  skills: ['TypeScript', 'Vue'],
  location: 'Milan',
  location_geo: null,
  created_at: '2024-01-01',
  source_url: null,
  company: null,
  ...overrides,
})

const makeJobsResponse = (jobs: JobListItem[]): ApiResponse<JobsListResponse> => ({
  success: true,
  status: 200,
  message: 'ok',
  data: {
    jobs,
    pagination: { total: jobs.length, page: 1, pages: 1, limit: 25 },
  },
})

describe('jobsService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getJobs returns paginated data mapped from API response', async () => {
    const jobs = [makeJob({ id: 'a' }), makeJob({ id: 'b' })]
    vi.spyOn(api.jobsApi, 'getJobs').mockResolvedValueOnce(makeJobsResponse(jobs))

    const result = await jobsService.getJobs()

    expect(result.total).toBe(2)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toBe('a')
    expect(result.page).toBe(1)
    expect(result.pages).toBe(1)
  })

  it('getJobs forwards query params to the API', async () => {
    const spy = vi.spyOn(api.jobsApi, 'getJobs').mockResolvedValueOnce(makeJobsResponse([]))

    await jobsService.getJobs({ status: 'active', limit: 10 })

    expect(spy).toHaveBeenCalledWith({ status: 'active', limit: 10 })
  })

  it('getJobsWithLocation filters out jobs without location_geo', async () => {
    const geo: GeoPoint = { type: 'Point', coordinates: [9.19, 45.46] }
    const jobs = [
      makeJob({ id: 'no-geo', location_geo: null }),
      makeJob({ id: 'with-geo', location_geo: geo }),
    ]
    vi.spyOn(api.jobsApi, 'getJobs').mockResolvedValueOnce(makeJobsResponse(jobs))

    const result = await jobsService.getJobsWithLocation()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('with-geo')
  })

  it('getJobsWithLocation requests active jobs with given limit', async () => {
    const spy = vi.spyOn(api.jobsApi, 'getJobs').mockResolvedValueOnce(makeJobsResponse([]))

    await jobsService.getJobsWithLocation(100)

    expect(spy).toHaveBeenCalledWith({ limit: 100, status: 'active' })
  })

  it('deleteJob delegates to the API', async () => {
    const spy = vi.spyOn(api.jobsApi, 'deleteJob').mockResolvedValueOnce({
      success: true,
      status: 200,
      message: 'ok',
      data: null,
    })

    await jobsService.deleteJob('job-xyz')

    expect(spy).toHaveBeenCalledWith('job-xyz')
  })
})
