<template>
  <header class="top-0 z-10 sticky flex items-center bg-background px-4 md:px-6 border-b h-16 shrink-0">
    <div class="flex items-center gap-4">
      <SidebarTrigger class="md:hidden" />
      <div class="hidden md:flex items-center space-x-2 text-muted-foreground text-sm">
        <!-- Minimal Breadcrumb based on route meta -->
        <span class="font-medium text-foreground capitalize">{{ currentRouteName }}</span>
      </div>
    </div>

    <div class="flex items-center gap-4 ml-auto">
      <!-- Language Selector -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" :aria-label="t('layout.header.changeLanguage')">
            <Globe class="w-[1.2rem] h-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="setLocale('it')">Italiano</DropdownMenuItem>
          <DropdownMenuItem @click="setLocale('en')">English</DropdownMenuItem>
          <DropdownMenuItem @click="setLocale('fr')">Français</DropdownMenuItem>
          <DropdownMenuItem @click="setLocale('es')">Español</DropdownMenuItem>
          <DropdownMenuItem @click="setLocale('de')">Deutsch</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- User Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative rounded-full w-8 h-8">
            <Avatar class="w-8 h-8">
              <AvatarImage :src="authStore.user?.avatar || ''" :alt="authStore.userName" />
              <AvatarFallback>{{ authStore.user?.firstName?.[0] || 'U' }}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end" force-mount>
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="font-medium text-sm leading-none">{{ authStore.userName }}</p>
              <p class="text-muted-foreground text-xs leading-none">{{ authStore.user?.email }}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <!-- TODO: Profile page route -->
            <UserIcon class="mr-2 w-4 h-4" />
            <span>{{ t('layout.header.profile') }}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout" class="text-destructive">
            <LogOut class="mr-2 w-4 h-4" />
            <span>{{ t('layout.header.logout') }}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useI18n } from 'vue-i18n'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Globe, User as UserIcon, LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const currentRouteName = computed(() => {
  return typeof route.name === 'string' ? route.name.replace('-', ' ') : 'Dashboard'
})

function setLocale(lang: string) {
  locale.value = lang
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
