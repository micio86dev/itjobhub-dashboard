import { adminApi, jobsApi } from '@/api'

export interface OverviewStats {
  users: number
  jobs: number
  companies: number
  news: number
  usersChange: number
  jobsChange: number
}

export interface TimelinePoint {
  date: string
  count: number
}

export interface LoginMethodStat {
  method: string
  count: number
}

export interface SkillStat {
  skill: string
  count: number
}

interface BackendStats {
  overview?: {
    users?: { total?: number; new?: number }
    jobs?: { total?: number; new?: number }
    companies?: { total?: number; new?: number }
    news?: { total?: number }
  }
}

async function getOverviewStats(): Promise<OverviewStats> {
  const res = await adminApi.getStats()
  const d = (res.data as BackendStats | null) ?? {}
  return {
    users: d.overview?.users?.total ?? 0,
    jobs: d.overview?.jobs?.total ?? 0,
    companies: d.overview?.companies?.total ?? 0,
    news: d.overview?.news?.total ?? 0,
    usersChange: d.overview?.users?.new ?? 0,
    jobsChange: d.overview?.jobs?.new ?? 0,
  }
}

async function getRegistrationsTimeline(days = 30): Promise<TimelinePoint[]> {
  const res = await adminApi.getRegistrationsTimeline({ days })
  const raw = res.data
  return Array.isArray(raw) ? (raw as TimelinePoint[]) : []
}

async function getJobsTimeline(weeks = 8): Promise<TimelinePoint[]> {
  const res = await adminApi.getJobsTimeline({ weeks })
  const raw = res.data as Array<{ week: string; count: number }> | null
  return (raw ?? []).map((item) => ({ date: item.week, count: item.count }))
}

async function getLoginMethodsDistribution(): Promise<LoginMethodStat[]> {
  const res = await adminApi.getLoginMethods()
  const raw = res.data
  return Array.isArray(raw) ? (raw as LoginMethodStat[]) : []
}

async function getTopSkills(limit = 10): Promise<SkillStat[]> {
  const res = await jobsApi.getSkillsStats()
  return res.data.slice(0, limit)
}

async function getTopLanguages(limit = 10): Promise<SkillStat[]> {
  const res = await adminApi.getTopLanguages({ limit })
  const raw = res.data as Array<{ language: string; count: number }> | null
  return (raw ?? []).slice(0, limit).map((item) => ({ skill: item.language, count: item.count }))
}

export const analyticsService = {
  getOverviewStats,
  getRegistrationsTimeline,
  getJobsTimeline,
  getLoginMethodsDistribution,
  getTopSkills,
  getTopLanguages,
}
