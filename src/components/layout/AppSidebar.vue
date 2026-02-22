<template>
  <Sidebar>
    <SidebarHeader class="p-4 border-b">
      <div class="flex items-center gap-2 font-bold text-foreground text-lg">
        <div class="flex justify-center items-center bg-brand-neon p-1 rounded-md w-8 h-8 text-black">
          <Briefcase class="w-5 h-5" />
        </div>
        <span>DevBoards.io</span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>{{ t('layout.sidebar.mainMenu') }}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in navItems" :key="item.path">
            <SidebarMenuButton as-child :is-active="route.path === item.path || route.path.startsWith(item.path + '/')">
              <RouterLink :to="item.path" class="flex items-center gap-3">
                <component :is="item.icon" class="w-4 h-4" />
                <span>{{ item.label }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="p-4 border-t">
      <div class="flex items-center gap-3" v-if="authStore.user">
        <Avatar>
          <AvatarImage :src="authStore.user.avatar || ''" :alt="authStore.userName" />
          <AvatarFallback>{{ authStore.user.firstName?.[0] }}{{ authStore.user.lastName?.[0] }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col flex-1 truncate">
          <span class="font-medium text-sm">{{ authStore.userName }}</span>
          <span class="text-muted-foreground text-xs truncate">{{ authStore.user.email }}</span>
        </div>
        <Button variant="ghost" size="icon" @click="handleLogout" title="Logout">
          <LogOut class="w-4 h-4 text-muted-foreground hover:text-destructive cursor-pointer" />
        </Button>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'

import {
  Briefcase,
  LayoutDashboard,
  Users,
  Building2,
  Map,
  Newspaper,
  BarChart3,
  Wrench,
  LogOut
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const navItems = computed(() => [
  { path: '/dashboard', label: t('layout.sidebar.overview'), icon: LayoutDashboard },
  { path: '/dashboard/users', label: t('layout.sidebar.users'), icon: Users },
  { path: '/dashboard/companies', label: t('layout.sidebar.companies'), icon: Building2 },
  { path: '/dashboard/jobs', label: t('layout.sidebar.jobs'), icon: Briefcase },
  { path: '/dashboard/jobs/map', label: t('layout.sidebar.map'), icon: Map },
  { path: '/dashboard/news', label: t('layout.sidebar.news'), icon: Newspaper },
  { path: '/dashboard/analytics', label: t('layout.sidebar.analytics'), icon: BarChart3 },
  { path: '/dashboard/skills', label: t('layout.sidebar.skills'), icon: Wrench },
])

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.bg-brand-neon {
  background-color: #22c55e;
}

/* Active link highlight */
[data-active="true"] {
  background-color: #dcfce7 !important;
  /* Tailwind green-100 */
  color: #166534 !important;
  /* Tailwind green-800 */
}

.dark [data-active="true"] {
  background-color: #14532d !important;
  /* Tailwind green-900 */
  color: #4ade80 !important;
  /* Tailwind green-400 */
}
</style>
