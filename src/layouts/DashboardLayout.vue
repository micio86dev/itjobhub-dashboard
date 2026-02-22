<script setup lang="ts">
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider>
    <div class="dashboard-wrapper" data-testid="dashboard-layout">
      <AppSidebar />
      <SidebarInset class="dashboard-main-column">
        <AppHeader />
        <main class="dashboard-main-content" data-testid="dashboard-main">
          <slot />
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
</template>
