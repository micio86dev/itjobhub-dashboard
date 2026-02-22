<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="font-bold text-3xl tracking-tight">{{ t('newsList.title') }}</h2>
      <Button>
        <Plus class="mr-2 w-4 h-4" />
        {{ t('newsList.addNews') }}
      </Button>
    </div>

    <!-- Filters -->
    <div class="flex sm:flex-row flex-col gap-4 mb-6">
      <div class="relative w-full sm:max-w-md">
        <Search class="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
        <Input v-model="filters.search" :placeholder="t('newsList.searchPlaceholder')" class="pl-9"
          @input="handleSearch" />
      </div>
    </div>

    <!-- Error Alert -->
    <Alert v-if="isError" variant="destructive">
      <AlertTitle>{{ t('overview.error') }}</AlertTitle>
      <AlertDescription class="flex justify-between items-center">
        <span>{{ t('overview.error') }}</span>
        <Button variant="outline" size="sm" @click="() => refetch()">{{ t('overview.retry') }}</Button>
      </AlertDescription>
    </Alert>

    <!-- Layout -->
    <div v-if="isLoading" class="space-y-4">
      <Card v-for="i in 4" :key="i">
        <CardContent class="p-6">
          <div class="space-y-3">
            <Skeleton class="w-3/4 h-6" />
            <Skeleton class="w-1/4 h-4" />
            <Skeleton class="w-full h-4" />
            <Skeleton class="w-full h-4" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="newsData?.data.length === 0"
      class="bg-muted/20 py-12 border border-dashed rounded-xl text-muted-foreground text-center">
      <Newspaper class="mx-auto mb-4 w-12 h-12 text-muted-foreground/50" />
      {{ t('newsList.noItems') }}
    </div>

    <div v-else class="gap-6 grid md:grid-cols-2">
      <Card v-for="item in newsData?.data" :key="item.id"
        class="group flex flex-col hover:shadow-md hover:border-brand-neon transition-all duration-200 cursor-pointer">
        <CardHeader class="pb-3">
          <div class="flex justify-between items-start gap-4 mb-2">
            <Badge variant="secondary" class="font-normal">{{ item.category }}</Badge>
            <span class="flex items-center gap-1 text-muted-foreground text-xs shrink-0">
              <Calendar class="w-3 h-3" />
              {{ formatDate(item.created_at) }}
            </span>
          </div>
          <CardTitle class="group-hover:text-brand-neon text-xl transition-colors duration-200">
            {{ item.title }}
          </CardTitle>
        </CardHeader>
        <CardContent class="flex-1 text-muted-foreground text-sm">
          <p class="line-clamp-3">{{ item.content }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Search, Plus, Calendar, Newspaper } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

import { newsService } from '@/services/news.service'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const { t } = useI18n()

const filters = ref({
  search: ''
})

const { data: newsData, isLoading, isError, refetch } = useQuery({
  queryKey: ['news', filters],
  queryFn: () => newsService.getNews({
    search: filters.value.search
  }),
  staleTime: 5 * 60 * 1000
})

const handleSearch = useDebounceFn(() => {
  refetch()
}, 300)

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: it })
}
</script>
