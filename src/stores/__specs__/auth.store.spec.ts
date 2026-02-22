import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import Cookies from 'js-cookie'
import { useAuthStore } from '../auth.store'
import * as api from '@/api'
import type { ApiResponse } from '@/api'
import type { LoginResponse } from '@/api/auth'
import type { Me } from '@/api'

const makeMeResponse = (overrides: Partial<Me> = {}): ApiResponse<Me> => ({
  success: true,
  status: 200,
  message: 'ok',
  data: {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: null,
    location: null,
    bio: null,
    createdAt: '2024-01-01',
    profileCompleted: true,
    ...overrides,
  },
})

const makeLoginResponse = (token = 'tok123'): ApiResponse<LoginResponse> => ({
  success: true,
  status: 200,
  message: 'ok',
  data: {
    token,
    user: {
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: '2024-01-01',
      profileCompleted: true,
    },
  },
})

describe('useAuthStore', () => {
  beforeEach(() => {
    Cookies.remove('admin-token')
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes as unauthenticated', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('sets token and user on successful login', async () => {
    vi.spyOn(api.authApi, 'login').mockResolvedValueOnce(makeLoginResponse())
    vi.spyOn(api.usersApi, 'getMe').mockResolvedValueOnce(makeMeResponse())

    const store = useAuthStore()
    await store.login('admin@example.com', 'password')

    expect(store.token).toBe('tok123')
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('admin@example.com')
  })

  it('sets error and rethrows on failed login', async () => {
    vi.spyOn(api.authApi, 'login').mockRejectedValueOnce(new Error('Invalid credentials'))

    const store = useAuthStore()
    await expect(store.login('bad@email.com', 'wrong')).rejects.toThrow('Invalid credentials')
    expect(store.error).toBe('Invalid credentials')
    expect(store.isAuthenticated).toBe(false)
  })

  it('clears auth state on logout', async () => {
    vi.spyOn(api.authApi, 'login').mockResolvedValueOnce(makeLoginResponse())
    vi.spyOn(api.usersApi, 'getMe').mockResolvedValueOnce(makeMeResponse())
    vi.spyOn(api.authApi, 'logout').mockResolvedValueOnce({ success: true, status: 200, message: 'ok', data: null })

    const store = useAuthStore()
    await store.login('admin@example.com', 'password')
    expect(store.isAuthenticated).toBe(true)

    store.logout()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('clearError resets the error state', async () => {
    vi.spyOn(api.authApi, 'login').mockRejectedValueOnce(new Error('Bad request'))

    const store = useAuthStore()
    await expect(store.login('x', 'y')).rejects.toThrow()
    expect(store.error).not.toBeNull()

    store.clearError()
    expect(store.error).toBeNull()
  })

  it('userName returns full name when both firstName and lastName are set', async () => {
    vi.spyOn(api.authApi, 'login').mockResolvedValueOnce(makeLoginResponse())
    vi.spyOn(api.usersApi, 'getMe').mockResolvedValueOnce(makeMeResponse({ firstName: 'John', lastName: 'Doe' }))

    const store = useAuthStore()
    await store.login('admin@example.com', 'password')
    expect(store.userName).toBe('John Doe')
  })

  it('fetchMe does nothing when there is no token', async () => {
    const spy = vi.spyOn(api.usersApi, 'getMe')
    const store = useAuthStore()
    await store.fetchMe()
    expect(spy).not.toHaveBeenCalled()
  })
})
