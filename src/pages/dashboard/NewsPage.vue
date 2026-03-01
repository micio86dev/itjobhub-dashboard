<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import DataTable from '@/components/organisms/DataTable.vue'
import { newsService } from '@/services/news.service'
import type { ColumnDef } from '@tanstack/vue-table'
import type { NewsItem } from '@/api'

const { t } = useI18n()
const categoryFilter = shallowRef('')

const queryParams = computed(() => ({
  limit: 50,
  category: categoryFilter.value || undefined,
}))

const newsQ = useQuery({
  queryKey: ['news-page', queryParams],
  queryFn: () => newsService.getNewsList(queryParams.value),
})

const columns: ColumnDef<NewsItem>[] = [
  { id: 'title', accessorKey: 'title', header: t('news.newsTitle') },
  { id: 'category', accessorKey: 'category', header: t('news.category') },
  { id: 'language', accessorKey: 'language', header: t('news.language') },
  { id: 'published_at', accessorFn: (r) => r.published_at?.slice(0, 10) ?? '-', header: t('news.publishedAt') },
  { id: 'likes', accessorKey: 'likes', header: '👍' },
  { id: 'comments_count', accessorKey: 'comments_count', header: '💬' },
]
</script>

<template>
  <div class="page-stack">

    <div class="page-header-row">
      <div class="page-title-group">
        <h1 class="page-title">{{ $t('news.title') }}</h1>
        <span v-if="newsQ.data.value" class="badge">{{ newsQ.data.value.total }}</span>
      </div>
    </div>

    <div>
      <input v-model="categoryFilter" type="text" :placeholder="$t('news.category')" class="form-search" />
    </div>

    <DataTable
      :columns="columns"
      :data="newsQ.data.value?.items ?? []"
      :loading="newsQ.isPending.value"
      :exportable="true"
    />

  </div>
</template>
