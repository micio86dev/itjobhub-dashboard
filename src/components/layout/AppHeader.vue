<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { Globe, LogOut, User } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/layout/ThemeToggle.vue";
import { useAuthStore } from "@/stores/auth.store";

const route = useRoute();
const { t, locale } = useI18n();
const authStore = useAuthStore();

const breadcrumbs = computed(
  () => (route.meta.breadcrumb ?? []) as Array<{ name: string; path?: string }>,
);
const titleKey = computed(() => {
  const lastCrumb = breadcrumbs.value[breadcrumbs.value.length - 1];
  return (route.meta.title as string | undefined) ?? lastCrumb?.name;
});

const locales = ["it", "en", "fr", "es", "de"] as const;

const userInitials = computed(() => {
  if (!authStore.user) return "";
  const first = authStore.user.first_name?.[0] ?? "";
  const last = authStore.user.last_name?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
});
</script>

<template>
  <header class="header-container" data-testid="app-header">
    <div class="header-left">
      <SidebarTrigger class="hide-mobile" :aria-label="t('header.openNav')" />
      <nav class="header-breadcrumb" data-testid="breadcrumb">
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.name">
          <span v-if="index > 0">/</span>
          <RouterLink v-if="crumb.path" :to="crumb.path" class="header-breadcrumb-link">
            {{ t(crumb.name) }}
          </RouterLink>
          <span v-else>{{ t(crumb.name) }}</span>
        </template>
      </nav>
      <h1 class="header-title">
        {{ titleKey ? t(titleKey) : "" }}
      </h1>
    </div>
    <div class="header-right">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="btn-icon-gap" data-testid="language-selector">
            <Globe class="icon-sm" />
            <span class="uppercase">{{ locale }}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem v-for="lang in locales" :key="lang" @click="locale = lang">
            {{ lang.toUpperCase() }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" data-testid="avatar-menu">
            <Avatar>
              <AvatarImage v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <User class="icon-sm" style="margin-right: 0.5rem" />
            {{ t("header.profile") }}
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="logout-menu-item" @click="authStore.logout">
            <LogOut class="icon-sm" style="margin-right: 0.5rem" />
            {{ t("header.logout") }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
