<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  LayoutDashboard, Users, Building2, Briefcase, Map,
  Newspaper, BarChart3, Wrench, LogOut, Mail,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = computed(() => [
  { key: 'overview', to: '/dashboard', icon: LayoutDashboard, label: t('nav.overview'), exact: true },
  { key: 'users', to: '/dashboard/users', icon: Users, label: t('nav.users') },
  { key: 'companies', to: '/dashboard/companies', icon: Building2, label: t('nav.companies') },
  { key: 'jobs', to: '/dashboard/jobs', icon: Briefcase, label: t('nav.jobs'), exact: true },
  { key: 'jobs-map', to: '/dashboard/jobs/map', icon: Map, label: t('nav.jobsMap') },
  { key: 'news', to: '/dashboard/news', icon: Newspaper, label: t('nav.news') },
  { key: 'analytics', to: '/dashboard/analytics', icon: BarChart3, label: t('nav.analytics') },
  { key: 'skills', to: '/dashboard/skills', icon: Wrench, label: t('nav.skills') },
  { key: 'messages', to: '/dashboard/messages', icon: Mail, label: t('nav.messages') },
])

function isActive(item: { to: string; exact?: boolean }) {
  if (item.exact) return route.path === item.to
  return route.path.startsWith(item.to)
}

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <aside class="app-sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <Briefcase class="h-7 w-7 brand-icon" />
      <span class="sidebar-logo-text">DevBoards</span>
      <span class="badge-primary">Admin</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul class="sidebar-nav-list">
        <li v-for="item in navItems" :key="item.key">
          <router-link :to="item.to" class="nav-link" :class="{ 'is-active': isActive(item) }">
            <component :is="item.icon" class="nav-icon" />
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User footer -->
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <span class="user-avatar user-avatar-md">
          {{ authStore.userName.slice(0, 2) || 'AD' }}
        </span>
        <div class="sidebar-user-meta">
          <span class="sidebar-user-name">{{ authStore.userName }}</span>
          <span class="sidebar-user-email">{{ authStore.user?.email }}</span>
        </div>
      </div>
      <button class="btn-ghost-danger logout-btn" @click="handleLogout">
        <LogOut class="h-4 w-4" />
        {{ $t('auth.logout') }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.brand-icon {
  color: var(--c-primary);
  flex-shrink: 0;
}

.nav-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.logout-btn {
  width: 100%;
  justify-content: flex-start;
}
</style>
