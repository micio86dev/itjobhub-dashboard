<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <h2 class="font-bold text-3xl tracking-tight">{{ t('users.title') }}</h2>
        <Badge variant="secondary" class="text-sm">
          {{ usersData?.total || 0 }} {{ t('users.totalBadge') }}
        </Badge>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex sm:flex-row flex-col gap-4">
      <div class="relative w-full sm:max-w-xs">
        <Search class="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
        <Input
          v-model="filters.search"
          :placeholder="t('users.searchPlaceholder')"
          class="pl-9"
          @input="handleSearch"
        />
      </div>
      <Select v-model="filters.loginMethod" @update:model-value="() => refetch()">
        <SelectTrigger class="w-[180px]">
          <SelectValue :placeholder="t('users.filters.allMethods')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{{ t('users.filters.allMethods') }}</SelectItem>
          <SelectItem value="email">{{ t('users.filters.email') }}</SelectItem>
          <SelectItem value="google">{{ t('users.filters.google') }}</SelectItem>
          <SelectItem value="linkedin">{{ t('users.filters.linkedin') }}</SelectItem>
          <SelectItem value="github">{{ t('users.filters.github') }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Alert v-if="isError" variant="destructive">
      <AlertTitle>{{ t('overview.error') }}</AlertTitle>
      <AlertDescription class="flex justify-between items-center">
        <span>Impossibile caricare gli utenti.</span>
        <Button variant="outline" size="sm" @click="refetch">{{ t('overview.retry') }}</Button>
      </AlertDescription>
    </Alert>

    <!-- Table -->
    <DataTable
      :columns="columns"
      :data="(usersData?.data as any) || []"
      :loading="isLoading"
      :total-rows="usersData?.total"
      :page-size="10"
    >
      <template #row-actions="{ row }">
        <Button variant="ghost" size="sm" @click="openSheet(row as unknown as User)">
          {{ t('users.actions.viewProfile') }}
        </Button>
      </template>
    </DataTable>

    <!-- Sheet Dettaglio Utente -->
    <Sheet :open="isSheetOpen" @update:open="isSheetOpen = $event">
      <SheetContent class="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{{ t('users.details.title') }}</SheetTitle>
          <SheetDescription>{{ t('users.details.description') }}</SheetDescription>
        </SheetHeader>
        
        <div v-if="selectedUser" class="space-y-6 mt-6">
          <div class="flex items-center gap-4">
            <Avatar class="w-16 h-16">
              <AvatarImage :src="selectedUser.avatar || ''" />
              <AvatarFallback>{{ selectedUser.first_name?.[0] }}{{ selectedUser.last_name?.[0] }}</AvatarFallback>
            </Avatar>
            <div>
              <h3 class="font-semibold text-xl">{{ selectedUser.first_name }} {{ selectedUser.last_name }}</h3>
              <p class="text-muted-foreground text-sm">{{ selectedUser.email }}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <h4 class="flex items-center gap-2 font-medium"><UserIcon class="w-4 h-4"/> {{ t('users.details.personalInfo') }}</h4>
            <div class="gap-4 grid grid-cols-2 text-sm">
              <div>
                <span class="text-muted-foreground">{{ t('users.details.role') }}:</span>
                <p class="font-medium capitalize">{{ selectedUser.role }}</p>
              </div>
              <div>
                <span class="text-muted-foreground">{{ t('users.details.phone') }}:</span>
                <p class="font-medium">{{ selectedUser.phone || t('users.details.noData') }}</p>
              </div>
              <div class="col-span-2">
                <span class="text-muted-foreground">{{ t('users.details.location') }}:</span>
                <p class="font-medium">{{ selectedUser.location || t('users.details.noData') }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="selectedUser.bio" class="space-y-2 text-sm">
            <span class="text-muted-foreground">{{ t('users.details.bio') }}:</span>
            <p class="bg-muted p-3 rounded-md">{{ selectedUser.bio }}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Search, User as UserIcon } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'

import { getUsersColumns } from '@/components/organisms/columns/users.columns'
import { usersService } from '@/services/users.service'
import type { User } from '@/types/api'

import DataTable from '@/components/organisms/DataTable.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

const { t } = useI18n()

const filters = ref({
  search: '',
  loginMethod: 'all'
})

import type { ColumnDef } from '@tanstack/vue-table'

const columns = computed(() => getUsersColumns(t) as unknown as ColumnDef<Record<string, unknown>, unknown>[])

// Query
const { data: usersData, isLoading, isError, refetch } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => usersService.getUsers({
    search: filters.value.search,
    loginMethod: filters.value.loginMethod !== 'all' ? filters.value.loginMethod : undefined
  }),
  staleTime: 5 * 60 * 1000
})

const handleSearch = useDebounceFn(() => {
  refetch()
}, 300)

// Sheet
const isSheetOpen = ref(false)
const selectedUser = ref<User | null>(null)

const openSheet = (user: User) => {
  selectedUser.value = user
  isSheetOpen.value = true
}
</script>
