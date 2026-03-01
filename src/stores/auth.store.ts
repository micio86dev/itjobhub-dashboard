import { defineStore } from 'pinia'
import { shallowRef, computed } from 'vue'
import Cookies from 'js-cookie'
import { authApi, usersApi, setToken, getToken } from '@/api'
import type { Me } from '@/api'

const TOKEN_KEY = 'admin-token'
const COOKIE_DAYS = 7

export const useAuthStore = defineStore('auth', () => {
  const token = shallowRef<string | null>(Cookies.get(TOKEN_KEY) ?? null)
  const user = shallowRef<Me | null>(null)
  const loading = shallowRef(false)
  const error = shallowRef<string | null>(null)

  const isAuthenticated = computed(() => token.value !== null && user.value !== null)
  const userName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName ?? ''} ${user.value.lastName ?? ''}`.trim() || user.value.email
  })

  // Sync token with API client whenever it changes
  if (token.value) {
    setToken(token.value)
  }

  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const res = await authApi.login({ email, password })
      const { token: authToken, user: authUser } = res.data
      token.value = authToken
      Cookies.set(TOKEN_KEY, authToken, { expires: COOKIE_DAYS })
      setToken(authToken)
      // fetchMe to get the full user profile
      try {
        const meRes = await usersApi.getMe()
        user.value = meRes.data
      } catch {
        // Fallback: build minimal user from auth response
        user.value = authUser as Me
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMe(): Promise<void> {
    if (!token.value) return
    try {
      const res = await usersApi.getMe()
      user.value = res.data
    } catch {
      // Token invalid — clear session
      logout()
    }
  }

  function logout(): void {
    token.value = null
    user.value = null
    error.value = null
    Cookies.remove(TOKEN_KEY)
    setToken(null)
    // Fire-and-forget server logout
    authApi.logout().catch(() => undefined)
  }

  function clearError(): void {
    error.value = null
  }

  // Expose the current token for the API client interceptor pattern
  function currentToken(): string | null {
    return getToken()
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userName,
    login,
    logout,
    fetchMe,
    clearError,
    currentToken,
  }
})
