import { describe, it, expect, beforeEach, vi } from "vitest";
import Cookies from "js-cookie";
import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import * as apiClient from "@/services/api.client";
import router from "@/router";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types/api";

const user: User = {
  id: "1",
  email: "admin@example.com",
  first_name: "Admin",
  last_name: "User",
  role: "admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

beforeEach(() => {
  Cookies.remove("admin-token");
  Cookies.remove("admin-refresh-token");
  setActivePinia(createTestingPinia({ createSpy: vi.fn, stubActions: false }));
});

describe("auth.store", () => {
  it("initial state", () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.loading).toBe(false);
  });

  it("isAuthenticated getter", () => {
    const store = useAuthStore();
    store.token = "token";
    store.user = user;
    expect(store.isAuthenticated).toBe(true);
  });

  it("login sets token, user, cookie", async () => {
    vi.spyOn(apiClient, "apiFetch").mockResolvedValue({
      data: {
        user,
        token: "token",
        refreshToken: "refresh",
      },
    });

    const store = useAuthStore();
    await store.login(user.email, "password123");

    expect(store.token).toBe("token");
    expect(store.user?.email).toBe(user.email);
    expect(Cookies.get("admin-token")).toBe("token");
  });

  it("login error sets error", async () => {
    vi.spyOn(apiClient, "apiFetch").mockRejectedValue(new Error("Invalid"));
    const store = useAuthStore();

    await expect(store.login("bad@example.com", "wrong")).rejects.toBeDefined();
    expect(store.error).toBe("Invalid");
  });

  it("logout clears token, user, cookie", async () => {
    vi.spyOn(apiClient, "apiFetch").mockResolvedValue({});
    vi.spyOn(router, "push").mockResolvedValue();

    const store = useAuthStore();
    store.token = "token";
    store.user = user;
    Cookies.set("admin-token", "token");

    await store.logout();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(Cookies.get("admin-token")).toBeUndefined();
  });

  it("fetchMe loads user when token exists", async () => {
    vi.spyOn(apiClient, "apiFetch").mockResolvedValue(user);

    const store = useAuthStore();
    store.token = "token";

    await store.fetchMe();
    expect(store.user?.id).toBe("1");
  });
});
