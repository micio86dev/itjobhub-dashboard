<template>
  <div class="grid grid-cols-1 md:grid-cols-2 min-h-screen">
    <!-- Left: Brand (hidden on mobile) -->
    <div class="hidden md:flex flex-col justify-center items-center bg-brand-neon p-8 text-black">
      <div class="max-w-md text-center">
        <div class="inline-flex justify-center items-center bg-black mb-8 p-4 rounded-full text-brand-neon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-briefcase">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <h1 class="mb-4 font-bold text-4xl tracking-tight">{{ t('layout.brand') }}</h1>
        <p class="opacity-80 font-light text-xl">{{ t('layout.slogan') }}</p>
      </div>
    </div>

    <!-- Right: Form slot -->
    <div class="relative flex flex-col bg-background">
      <div class="top-4 right-4 absolute text-foreground">
        <ThemeToggle />
      </div>
      <div class="flex flex-1 justify-center items-center p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'

const { t } = useI18n()
</script>

<style scoped>
/* Il colore brand-neon dovrebbe essere definito globalmente nel tailwind o css */
.bg-brand-neon {
  background-color: #22c55e;
}

.text-brand-neon {
  color: #22c55e;
}
</style>
