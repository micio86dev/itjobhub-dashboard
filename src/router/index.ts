import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue')
    },
    {
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'overview',
          component: () => import('@/pages/dashboard/OverviewPage.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/pages/dashboard/UsersPage.vue')
        },
        {
          path: 'companies',
          name: 'companies',
          component: () => import('@/pages/dashboard/CompaniesPage.vue')
        },
        {
          path: 'jobs',
          name: 'jobs',
          component: () => import('@/pages/dashboard/JobsPage.vue')
        },
        {
          path: 'jobs/map',
          name: 'jobs-map',
          component: () => import('@/pages/dashboard/JobsMapPage.vue')
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('@/pages/dashboard/NewsPage.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/pages/dashboard/AnalyticsPage.vue')
        },
        {
          path: 'skills',
          name: 'skills',
          component: () => import('@/pages/dashboard/SkillsPage.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue') // Fallback generic
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Prova a recuperare l'utente dal token se presente (e.g. reload)
      if (authStore.token) {
        await authStore.fetchMe();
        if (authStore.isAuthenticated) {
          next();
          return;
        }
      }
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
