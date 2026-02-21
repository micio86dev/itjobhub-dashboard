<template>
  <SidebarProvider>
    <AppSidebar />
    
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <AppHeader />
      <main class="flex-1 bg-muted/20 p-4 md:p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>
