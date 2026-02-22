import { ofetch } from "ofetch";
import type { Router } from "vue-router";

type AuthStoreLike = {
  token: string | null;
  logout: () => Promise<void>;
};

let authStorePromise: Promise<AuthStoreLike> | null = null;
let routerPromise: Promise<Router> | null = null;

async function getAuthStore() {
  if (!authStorePromise) {
    authStorePromise = import("@/stores/auth.store").then(
      (mod) => mod.useAuthStore() as AuthStoreLike,
    );
  }
  return authStorePromise;
}

async function getRouter() {
  if (!routerPromise) {
    routerPromise = import("@/router").then((mod) => mod.default);
  }
  return routerPromise;
}

type ApiFetch = <T>(url: string, options?: Parameters<typeof ofetch>[1]) => Promise<T>;

export const apiFetch = ofetch.create({
  baseURL: import.meta.env.PUBLIC_API_URL,
  async onRequest({ options }) {
    const authStore = await getAuthStore();
    const token = authStore.token;
    if (token) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
  },
  async onResponseError({ response }) {
    if (response.status === 401) {
      const authStore = await getAuthStore();
      await authStore.logout();
      const router = await getRouter();
      if (router.currentRoute.value.path !== "/login") {
        router.push("/login");
      }
    }
  },
}) as ApiFetch;
