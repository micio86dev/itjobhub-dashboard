import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    breadcrumb?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Root redirect
    { path: '/', redirect: '/dashboard' },

    // Auth layout
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/pages/auth/LoginPage.vue'),
          meta: { requiresAuth: false },
        },
      ],
    },

    // Dashboard layout
    {
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'overview',
          component: () => import('@/pages/dashboard/OverviewPage.vue'),
          meta: { breadcrumb: 'nav.overview' },
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/pages/dashboard/UsersPage.vue'),
          meta: { breadcrumb: 'nav.users' },
        },
        {
          path: 'companies',
          name: 'companies',
          component: () => import('@/pages/dashboard/CompaniesPage.vue'),
          meta: { breadcrumb: 'nav.companies' },
        },
        {
          path: 'jobs',
          name: 'jobs',
          component: () => import('@/pages/dashboard/JobsPage.vue'),
          meta: { breadcrumb: 'nav.jobs' },
        },
        {
          path: 'jobs/map',
          name: 'jobs-map',
          component: () => import('@/pages/dashboard/JobsMapPage.vue'),
          meta: { breadcrumb: 'nav.jobsMap' },
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('@/pages/dashboard/NewsPage.vue'),
          meta: { breadcrumb: 'nav.news' },
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/pages/dashboard/AnalyticsPage.vue'),
          meta: { breadcrumb: 'nav.analytics' },
        },
        {
          path: 'skills',
          name: 'skills',
          component: () => import('@/pages/dashboard/SkillsPage.vue'),
          meta: { breadcrumb: 'nav.skills' },
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/pages/dashboard/MessagesPage.vue'),
          meta: { breadcrumb: 'nav.messages' },
        },
      ],
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Attempt to hydrate from cookie before redirecting
    if (authStore.token) {
      await authStore.fetchMe()
      if (authStore.isAuthenticated) return true
    }
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'overview' }
  }

  return true
})

export default router
