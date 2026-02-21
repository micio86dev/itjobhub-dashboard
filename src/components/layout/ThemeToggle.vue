<template>
  <Button 
    variant="ghost" 
    size="icon" 
    @click="toggleTheme" 
    data-testid="theme-toggle"
    aria-label="Toggle theme"
  >
    <span class="sr-only">Toggle theme</span>
    <Moon 
      v-if="theme === 'dark'" 
      class="w-[1.2rem] h-[1.2rem] transition-all" 
    />
    <Sun 
      v-else 
      class="w-[1.2rem] h-[1.2rem] transition-all" 
    />
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>
