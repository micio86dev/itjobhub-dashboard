<template>
  <Card class="flex flex-col h-full" data-testid="top-list">
    <CardHeader class="pb-3">
      <CardTitle class="font-semibold text-lg">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="flex-1">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <Skeleton class="rounded-md w-6 h-6" />
          <div class="flex-1 space-y-2">
            <Skeleton class="w-full h-4" />
            <Skeleton class="w-3/4 h-2" />
          </div>
        </div>
      </div>
      
      <div v-else-if="items.length === 0" class="flex justify-center items-center py-8 h-full text-muted-foreground text-sm">
        Nessun dato disponibile
      </div>
      
      <div v-else class="flex flex-col space-y-4">
        <div 
          v-for="(item, index) in visibleItems" 
          :key="item.label"
          class="flex items-center gap-3"
        >
          <div class="flex justify-center items-center bg-muted rounded-md w-6 h-6 font-bold text-muted-foreground text-xs shrink-0">
            {{ index + 1 }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-end mb-1">
              <span class="pr-2 font-medium text-sm truncate" :title="item.label">{{ item.label }}</span>
              <span class="font-semibold text-sm whitespace-nowrap">{{ typeof item.count === 'number' ? item.count.toLocaleString() : item.count }}</span>
            </div>
            <!-- Progress bar background -->
            <div class="bg-secondary rounded-full w-full h-2 overflow-hidden">
              <!-- Progress bar foreground (brand color) -->
              <div 
                class="bg-brand-neon rounded-full h-full"
                :style="{ width: `${calculatePercentage(item.count)}%` }"
              ></div>
            </div>
          </div>
        </div>
        
        <div v-if="hasMore" class="mt-2 pt-2 border-t text-muted-foreground text-xs text-center">
          e altri {{ items.length - 10 }}...
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface TopListItem {
  label: string
  count: number
  extra?: string
}

const props = withDefaults(defineProps<{
  title: string
  items: TopListItem[]
  loading?: boolean
}>(), {
  items: () => []
})

const visibleItems = computed(() => {
  return props.items.slice(0, 10)
})

const hasMore = computed(() => {
  return props.items.length > 10
})

const maxCount = computed(() => {
  if (props.items.length === 0) return 0
  return Math.max(...props.items.map(i => i.count))
})

const calculatePercentage = (count: number) => {
  if (maxCount.value === 0) return 0
  return Math.max(0, Math.min(100, (count / maxCount.value) * 100))
}
</script>

<style scoped>
.bg-brand-neon {
  background-color: #22c55e;
}
</style>
