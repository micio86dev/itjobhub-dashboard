<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronDown, User, LogOut, Menu } from 'lucide-vue-next'
import ThemeToggle from './ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth.store'
import { setLocale, type Locale } from '@/i18n'

const emit = defineEmits<{ 'toggle-sidebar': [] }>()

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const langMenuOpen = ref(false)
const userMenuOpen = ref(false)

const breadcrumb = computed(() => {
  const key = route.meta.breadcrumb
  return key ? t(key) : ''
})

const locales: { code: Locale; label: string }[] = [
  { code: 'it', label: 'Italiano' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
]

function selectLocale(code: Locale) {
  setLocale(code)
  langMenuOpen.value = false
}

async function handleLogout() {
  userMenuOpen.value = false
  authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <!-- Mobile hamburger -->
    <button class="btn-icon mobile-menu-btn" @click="emit('toggle-sidebar')">
      <Menu class="h-5 w-5" />
    </button>

    <!-- Breadcrumb -->
    <div class="header-breadcrumb">{{ breadcrumb }}</div>

    <!-- Actions -->
    <div class="header-actions">

      <!-- Language selector -->
      <div class="header-menu-anchor">
        <button class="header-lang-btn" @click="langMenuOpen = !langMenuOpen">
          {{ locale }}
          <ChevronDown class="h-3.5 w-3.5" />
        </button>
        <div v-if="langMenuOpen" class="dropdown lang-dropdown">
          <button
            v-for="loc in locales"
            :key="loc.code"
            class="dropdown-item"
            :class="{ 'is-active': locale === loc.code }"
            @click="selectLocale(loc.code)"
          >
            {{ loc.label }}
          </button>
        </div>
      </div>

      <ThemeToggle />

      <!-- User menu -->
      <div class="header-menu-anchor">
        <button class="header-user-btn" @click="userMenuOpen = !userMenuOpen">
          <span class="user-avatar user-avatar-sm">
            {{ authStore.userName.slice(0, 2) || 'AD' }}
          </span>
          <span class="user-name-label">{{ authStore.userName }}</span>
          <ChevronDown class="h-3.5 w-3.5" />
        </button>
        <div v-if="userMenuOpen" class="dropdown user-dropdown">
          <button class="dropdown-item" @click="userMenuOpen = false">
            <User class="h-4 w-4" />
            {{ $t('nav.profile') }}
          </button>
          <div class="dropdown-divider" />
          <button class="dropdown-item-danger" @click="handleLogout">
            <LogOut class="h-4 w-4" />
            {{ $t('auth.logout') }}
          </button>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
.mobile-menu-btn {
  /* visible only on mobile */
  display: none;
}

@media (max-width: 1023px) {
  .mobile-menu-btn {
    display: inline-flex;
  }
}

.header-menu-anchor {
  position: relative;
}

.lang-dropdown {
  min-width: 9rem;
}

.user-dropdown {
  min-width: 10rem;
}

.user-name-label {
  display: none;
  font-size: var(--text-sm);
}

@media (min-width: 768px) {
  .user-name-label {
    display: inline;
  }
}
</style>
