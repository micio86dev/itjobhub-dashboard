<template>
  <Card class="flex flex-col h-full" data-testid="map-filters">
    <CardHeader class="pb-3 border-b">
      <CardTitle class="flex justify-between items-center font-semibold text-lg">
        Filtri
        <Badge variant="secondary">{{ resultCount }} trovati</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent class="flex-1 space-y-6 p-4 overflow-y-auto">
      
      <!-- Radio Group: Model -->
      <div class="space-y-3">
        <h4 class="font-medium text-sm leading-none">Modalità di lavoro</h4>
        <RadioGroup v-model="filters.remote" class="flex flex-col space-y-1">
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="all" id="r-all" />
            <Label htmlFor="r-all" class="font-normal cursor-pointer">Tutti</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="remote" id="r-remote" />
            <Label htmlFor="r-remote" class="font-normal text-green-600 dark:text-green-500 cursor-pointer">Remote</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="hybrid" id="r-hybrid" />
            <Label htmlFor="r-hybrid" class="font-normal text-blue-600 dark:text-blue-500 cursor-pointer">Hybrid</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="onsite" id="r-onsite" />
            <Label htmlFor="r-onsite" class="font-normal text-zinc-600 dark:text-zinc-400 cursor-pointer">On-site</Label>
          </div>
        </RadioGroup>
      </div>

      <!-- Select: Contract Type -->
      <div class="space-y-3">
        <h4 class="font-medium text-sm leading-none">Tipo di contratto</h4>
        <Select v-model="filters.contractType">
          <SelectTrigger>
            <SelectValue placeholder="Seleziona tipo contratto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i tipi</SelectItem>
            <SelectItem value="FULL_TIME">Full-time</SelectItem>
            <SelectItem value="PART_TIME">Part-time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="FREELANCE">Freelance</SelectItem>
            <SelectItem value="INTERNSHIP">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Select: Experience Level -->
      <div class="space-y-3">
        <h4 class="font-medium text-sm leading-none">Esperienza</h4>
        <Select v-model="filters.experienceLevel">
          <SelectTrigger>
            <SelectValue placeholder="Seleziona esperienza" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Qualsiasi livello</SelectItem>
            <SelectItem value="JUNIOR">Junior</SelectItem>
            <SelectItem value="MID">Mid-level</SelectItem>
            <SelectItem value="SENIOR">Senior</SelectItem>
            <SelectItem value="LEAD">Lead/Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Select: Published Within -->
      <div class="space-y-3">
        <h4 class="font-medium text-sm leading-none">Data di pubblicazione</h4>
        <Select v-model="filters.publishedWithin">
          <SelectTrigger>
            <SelectValue placeholder="Seleziona periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sempre</SelectItem>
            <SelectItem value="7">Ultimi 7 giorni</SelectItem>
            <SelectItem value="30">Ultimi 30 giorni</SelectItem>
            <SelectItem value="90">Ultimi 3 mesi</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </CardContent>
    <div class="mt-auto p-4 border-t">
      <Button variant="outline" class="w-full" @click="resetFilters">
        <RotateCcw class="mr-2 w-4 h-4" />
        Reset filtri
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-vue-next'

defineProps<{
  resultCount: number
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: Record<string, unknown>): void
}>()

const initialFilters = {
  remote: 'all',
  contractType: 'all',
  experienceLevel: 'all',
  publishedWithin: 'all'
}

const filters = reactive({ ...initialFilters })

watch(filters, (newVal) => {
  emit('update:filters', newVal)
}, { deep: true })

const resetFilters = () => {
  Object.assign(filters, initialFilters)
}
</script>
