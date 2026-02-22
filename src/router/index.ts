import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const LoginPage = () => import("@/pages/auth/LoginPage.vue");
const OverviewPage = () => import("@/pages/dashboard/OverviewPage.vue");
const UsersPage = () => import("@/pages/dashboard/UsersPage.vue");
const CompaniesPage = () => import("@/pages/dashboard/CompaniesPage.vue");
const JobsPage = () => import("@/pages/dashboard/JobsPage.vue");
const JobsMapPage = () => import("@/pages/dashboard/JobsMapPage.vue");
const NewsPage = () => import("@/pages/dashboard/NewsPage.vue");
const AnalyticsPage = () => import("@/pages/dashboard/AnalyticsPage.vue");
const SkillsPage = () => import("@/pages/dashboard/SkillsPage.vue");
const NotFoundPage = () => import("@/pages/NotFoundPage.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/dashboard" },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { layout: "auth", title: "auth.title" },
    },
    {
      path: "/dashboard",
      name: "dashboard-overview",
      component: OverviewPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.overview",
        breadcrumb: [{ name: "nav.dashboard", path: "/dashboard" }, { name: "nav.overview" }],
      },
    },
    {
      path: "/dashboard/users",
      name: "dashboard-users",
      component: UsersPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.users",
        breadcrumb: [{ name: "nav.dashboard", path: "/dashboard" }, { name: "nav.users" }],
      },
    },
    {
      path: "/dashboard/companies",
      name: "dashboard-companies",
      component: CompaniesPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.companies",
        breadcrumb: [{ name: "nav.dashboard", path: "/dashboard" }, { name: "nav.companies" }],
      },
    },
    {
      path: "/dashboard/jobs",
      name: "dashboard-jobs",
      component: JobsPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.jobs",
        breadcrumb: [{ name: "nav.dashboard", path: "/dashboard" }, { name: "nav.jobs" }],
      },
    },
    {
      path: "/dashboard/jobs/map",
      name: "dashboard-jobs-map",
      component: JobsMapPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.jobsMap",
        breadcrumb: [
          { name: "nav.dashboard", path: "/dashboard" },
          { name: "nav.jobs", path: "/dashboard/jobs" },
          { name: "nav.jobsMap" },
        ],
      },
    },
    {
      path: "/dashboard/news",
      name: "dashboard-news",
      component: NewsPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.news",
        breadcrumb: [{ name: "nav.dashboard", path: "/dashboard" }, { name: "nav.news" }],
      },
    },
    {
      path: "/dashboard/analytics",
      name: "dashboard-analytics",
      component: AnalyticsPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.analytics",
        breadcrumb: [{ name: "nav.dashboard", path: "/dashboard" }, { name: "nav.analytics" }],
      },
    },
    {
      path: "/dashboard/skills",
      name: "dashboard-skills",
      component: SkillsPage,
      meta: {
        layout: "dashboard",
        requiresAuth: true,
        title: "nav.skills",
        breadcrumb: [{ name: "nav.dashboard", path: "/dashboard" }, { name: "nav.skills" }],
      },
    },
    {
      path: "/404",
      name: "not-found",
      component: NotFoundPage,
      meta: { layout: "empty" },
    },
    { path: "/:pathMatch(.*)*", redirect: "/404" },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }
  if (to.name === "login" && authStore.isAuthenticated) {
    return { name: "dashboard-overview" };
  }
  return true;
});

export default router;
