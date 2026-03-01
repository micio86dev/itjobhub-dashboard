import { newsApi } from '@/api'
import type { NewsItem } from '@/api'
import type { GetNewsListParams } from '@/api/news'

export interface PaginatedNews {
  items: NewsItem[]
  total: number
  page: number
  pages: number
}

async function getNewsList(params: GetNewsListParams = {}): Promise<PaginatedNews> {
  const res = await newsApi.getNewsList(params)
  const { news, pagination } = res.data
  return {
    items: news,
    total: pagination.total,
    page: pagination.page,
    pages: pagination.pages,
  }
}

async function deleteNews(id: string): Promise<void> {
  await newsApi.deleteNews(id)
}

export const newsService = { getNewsList, deleteNews }
