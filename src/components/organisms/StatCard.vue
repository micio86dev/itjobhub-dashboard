<template>
  <Card 
    class="hover:shadow-md transition-shadow duration-200"
    data-testid="stat-card"
  >
    <CardHeader class="flex flex-row justify-between items-center space-y-0 pb-2">
      <CardTitle class="font-medium text-muted-foreground text-sm">
        {{ title }}
      </CardTitle>
      <component
        v-if="icon"
        :is="icon"
        class="w-4 h-4 text-muted-foreground"
      />
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="space-y-2">
        <Skeleton class="w-[100px] h-8" />
        <Skeleton class="w-[60px] h-4" />
      </div>
      <div v-else>
        <div class="font-bold text-2xl" data-testid="stat-value">
          {{ value }}
        </div>
        <p 
          v-if="change !== undefined"
          class="flex items-center mt-1 text-sm"
          :class="change >= 0 ? 'text-green-500' : 'text-red-500'"
          data-testid="stat-change"
        >
          <ArrowUpRight v-if="change >= 0" class="mr-1 w-3 h-3" />
          <ArrowDownRight v-else class="mr-1 w-3 h-3" />
          <span class="font-medium">{{ Math.abs(change) }}%</span>
          <span class="ml-1 font-normal text-muted-foreground">dal mese scorso</span>
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'

export interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon?: Component
  loading?: boolean
}

defineProps<StatCardProps>()
</script>
