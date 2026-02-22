import { defineStore } from "pinia";
import Cookies from "js-cookie";
import type { AuthResponse, User, UserRole } from "@/types/api";
import { apiFetch } from "@/services/api.client";
import router from "@/router";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

const TOKEN_COOKIE = "admin-token";
const REFRESH_COOKIE = "admin-refresh-token";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: Cookies.get(TOKEN_COOKIE) ?? null,
    refreshToken: Cookies.get(REFRESH_COOKIE) ?? null,
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    userName: (state) => {
      if (!state.user) return "";
      return `${state.user.first_name} ${state.user.last_name}`.trim();
    },
    userRole: (state): UserRole | null => state.user?.role ?? null,
    isAdmin: (state) => state.user?.role === "admin",
  },
  actions: {
    async login(email: string, password: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiFetch<AuthResponse>("/auth/login", {
          method: "POST",
          body: { email, password },
        });

        const token = response.data.token;
        const refreshToken = response.data.refreshToken;

        this.token = token;
        this.refreshToken = refreshToken ?? null;
        this.user = response.data.user;

        Cookies.set(TOKEN_COOKIE, token, { expires: 7 });
        if (refreshToken) {
          Cookies.set(REFRESH_COOKIE, refreshToken, { expires: 7 });
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async logout(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await apiFetch("/auth/logout", { method: "POST" });
      } catch {
        // Ignore API errors on logout.
      } finally {
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        Cookies.remove(TOKEN_COOKIE);
        Cookies.remove(REFRESH_COOKIE);
        this.loading = false;
        router.push("/login");
      }
    },
    async fetchMe(): Promise<void> {
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await apiFetch<User | { data: User }>("/auth/user");
        this.user = "data" in response ? response.data : response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Auth error";
        await this.logout();
      } finally {
        this.loading = false;
      }
    },
    async refreshAuthToken(): Promise<void> {
      if (!this.refreshToken) return;
      try {
        const response = await apiFetch<{ token: string }>("/auth/refresh", {
          method: "POST",
        });
        this.token = response.token;
        Cookies.set(TOKEN_COOKIE, response.token, { expires: 7 });
      } catch {
        await this.logout();
      }
    },
    clearAuthError(): void {
      this.error = null;
    },
  },
});
