<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  BarChart3,
  Briefcase,
  Building2,
  LayoutDashboard,
  Map,
  Newspaper,
  Users,
  Wrench,
  LogOut,
  BriefcaseBusiness,
} from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();

const navItems = [
  { label: "nav.overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "nav.users", icon: Users, path: "/dashboard/users" },
  { label: "nav.companies", icon: Building2, path: "/dashboard/companies" },
  { label: "nav.jobs", icon: Briefcase, path: "/dashboard/jobs" },
  { label: "nav.jobsMap", icon: Map, path: "/dashboard/jobs/map" },
  { label: "nav.news", icon: Newspaper, path: "/dashboard/news" },
  { label: "nav.analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "nav.skills", icon: Wrench, path: "/dashboard/skills" },
];

const userInitials = computed(() => {
  if (!authStore.user) return "";
  const first = authStore.user.first_name?.[0] ?? "";
  const last = authStore.user.last_name?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
});
</script>

<template>
  <Sidebar collapsible="icon" class="border-r" data-testid="app-sidebar">
    <SidebarHeader class="px-4 py-6">
      <div class="sidebar-logo">
        <BriefcaseBusiness class="icon-md" />
        <span class="sidebar-logo-text">{{ t("app.name") }}</span>
      </div>
    </SidebarHeader>
    <SidebarContent class="px-2">
      <SidebarMenu>
        <SidebarMenuItem v-for="item in navItems" :key="item.path">
          <SidebarMenuButton
            as-child
            :is-active="route.path === item.path"
            :tooltip="t(item.label)"
            class="data-[active=true]:bg-brand-50 data-[active=true]:text-brand-700"
            :data-testid="`nav-item-${item.path}`"
          >
            <RouterLink class="sidebar-nav-link" :to="item.path">
              <component :is="item.icon" class="icon-sm" />
              <span>{{ t(item.label) }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter class="px-4 py-4">
      <div class="sidebar-user">
        <Avatar data-testid="sidebar-avatar">
          <AvatarImage v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
          <AvatarFallback>{{ userInitials }}</AvatarFallback>
        </Avatar>
        <div class="sidebar-user-name">
          {{ authStore.userName || "" }}
        </div>
      </div>
      <Button
        data-testid="logout-button"
        variant="ghost"
        class="sidebar-logout-btn"
        @click="authStore.logout"
      >
        <LogOut class="icon-sm" />
        <span>{{ t("header.logout") }}</span>
      </Button>
    </SidebarFooter>
  </Sidebar>
</template>
