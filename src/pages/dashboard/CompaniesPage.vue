<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
       <h2 class="font-bold text-3xl tracking-tight">{{ t('companies.title') }}</h2>
       <Button>
         <Plus class="mr-2 w-4 h-4" />
         {{ t('companies.addCompany') }}
       </Button>
    </div>

    <!-- Filters -->
    <div class="flex sm:flex-row flex-col gap-4">
      <div class="relative w-full sm:max-w-xs">
        <Search class="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
        <Input
          v-model="filters.search"
          :placeholder="t('companies.searchPlaceholder')"
          class="pl-9"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Error Alert -->
    <Alert v-if="isError" variant="destructive">
      <AlertTitle>{{ t('overview.error') }}</AlertTitle>
      <AlertDescription class="flex justify-between items-center">
        <span>Impossibile caricare le aziende.</span>
        <Button variant="outline" size="sm" @click="() => refetch()">{{ t('overview.retry') }}</Button>
      </AlertDescription>
    </Alert>

    <!-- Grid Layout -->
    <div v-if="isLoading" class="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card v-for="i in 8" :key="i" class="flex flex-col h-[200px]">
        <CardHeader class="flex-row items-center gap-4">
          <Skeleton class="rounded-full w-12 h-12" />
          <div class="flex-1 space-y-2">
            <Skeleton class="w-full h-4" />
            <Skeleton class="w-2/3 h-3" />
          </div>
        </CardHeader>
        <CardContent class="mt-auto">
          <Skeleton class="w-1/2 h-8" />
        </CardContent>
      </Card>
    </div>
    
    <div v-else-if="companiesData?.data.length === 0" class="py-10 text-muted-foreground text-center">
      {{ t('companies.noItems') }}
    </div>

    <div v-else class="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card 
        v-for="company in companiesData?.data" 
        :key="company.id"
        class="group flex flex-col hover:border-brand-neon transition-colors duration-200"
      >
        <CardHeader class="flex-row items-center gap-4">
          <Avatar class="bg-white border w-12 h-12 text-zinc-800">
            <AvatarImage :src="company.logo_url || ''" :alt="company.name" />
            <AvatarFallback class="font-bold">{{ company.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <CardTitle class="text-base truncate" :title="company.name">{{ company.name }}</CardTitle>
            <CardDescription class="truncate" v-if="company.industry">{{ company.industry }}</CardDescription>
          </div>
        </CardHeader>
        <CardContent class="flex-1 space-y-2 text-muted-foreground text-sm">
        </CardContent>
        <CardFooter class="pt-2">
          <a 
            v-if="company.website" 
            :href="company.website" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-medium hover:text-brand-neon text-sm hover:underline"
          >
            <LinkIcon class="w-3 h-3" /> {{ t('companies.website') }}
          </a>
          <span v-else class="text-muted-foreground text-sm italic">{{ t('companies.noData') || 'Sito web assente' }}</span>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Search, Plus, Link as LinkIcon } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'

import { companiesService } from '@/services/companies.service'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

const { t } = useI18n()

const filters = ref({
  search: ''
})

const { data: companiesData, isLoading, isError, refetch } = useQuery({
  queryKey: ['companies', filters],
  queryFn: () => companiesService.getCompanies({
    search: filters.value.search
  }),
  staleTime: 5 * 60 * 1000
})

const handleSearch = useDebounceFn(() => {
  refetch()
}, 300)
</script>
