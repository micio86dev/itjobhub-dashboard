type QueryValue = string | number | boolean | string[] | null | undefined
// Broad type for internal use: accepts any typed param interface without
// requiring an explicit index signature on the caller's side.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyParams = Record<string, any>

const BASE_URL = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? ''

let _token: string | null = null

export function setToken(token: string | null): void {
  _token = token
}

export function getToken(): string | null {
  return _token
}

export interface ApiResponse<T> {
  success: boolean
  status: number
  message: string
  data: T
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  params?: AnyParams
  body?: unknown
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = new URL(BASE_URL + path)

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value === undefined || value === null) continue
      if (Array.isArray(value)) {
        for (const item of value as QueryValue[]) {
          url.searchParams.append(key, String(item))
        }
      } else {
        url.searchParams.set(key, String(value as QueryValue))
      }
    }
  }

  const headers: Record<string, string> = {}

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  let payload: ApiResponse<T>
  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    throw new ApiError(response.status, response.statusText)
  }

  if (!response.ok) {
    throw new ApiError(response.status, payload.message ?? response.statusText)
  }

  return payload
}

export const http = {
  get: <T>(path: string, params?: AnyParams) =>
    request<T>('GET', path, { params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>('POST', path, { body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>('PUT', path, { body }),

  delete: <T>(path: string, params?: AnyParams) =>
    request<T>('DELETE', path, { params }),
}
