<script setup lang="ts">
import { shallowRef } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const sidebarOpen = shallowRef(false)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
</script>

<template>
  <div class="dashboard-layout">
    <!-- Desktop sidebar -->
    <div class="sidebar-desktop">
      <AppSidebar />
    </div>

    <!-- Mobile sidebar overlay -->
    <Transition name="sidebar-fade">
      <div v-if="sidebarOpen" class="sidebar-overlay">
        <div class="sidebar-backdrop" @click="sidebarOpen = false" />
        <div class="sidebar-drawer">
          <AppSidebar />
        </div>
      </div>
    </Transition>

    <!-- Main content area -->
    <div class="dashboard-main">
      <AppHeader @toggle-sidebar="toggleSidebar" />
      <main class="dashboard-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--c-surface-app);
}

.sidebar-desktop {
  display: none;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .sidebar-desktop {
    display: flex;
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
}

@media (min-width: 1024px) {
  .sidebar-overlay {
    display: none;
  }
}

.sidebar-backdrop {
  position: absolute;
  inset: 0;
  background-color: var(--c-backdrop);
}

.sidebar-drawer {
  position: relative;
  z-index: 50;
  display: flex;
  width: 16rem;
  flex-direction: column;
}

.dashboard-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* ── Sidebar transition ── */
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.3s ease;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}
</style>
