<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    data-testid="theme-toggle"
    class="btn-icon"
    :title="theme === 'dark' ? $t('theme.light') : $t('theme.dark')"
    :aria-label="$t('theme.toggle')"
    @click="toggleTheme"
  >
    <Sun v-if="theme === 'dark'" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
  </button>
</template>
