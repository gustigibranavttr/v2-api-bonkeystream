import type { ApiResponse } from '@/models/domain'

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://v2-api-bonkeystream.vercel.app').replace(/\/$/, '')
const cache = new Map<string, { expires: number; value: unknown }>()
const pending = new Map<string, Promise<unknown>>()

export class ApiError extends Error {
  constructor(message: string, public readonly status = 0) {
    super(message)
    this.name = 'ApiError'
  }
}

function abortable<T>(request: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return request
  if (signal.aborted) return Promise.reject(new DOMException('The request was aborted.', 'AbortError'))
  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException('The request was aborted.', 'AbortError'))
    signal.addEventListener('abort', abort, { once: true })
    request.then(
      (value) => { signal.removeEventListener('abort', abort); resolve(value) },
      (error) => { signal.removeEventListener('abort', abort); reject(error) },
    )
  })
}

export async function apiGet<T>(path: string, options: { signal?: AbortSignal; ttl?: number } = {}): Promise<T> {
  const key = `${API_BASE}${path}`
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) return cached.value as T

  const existing = pending.get(key)
  if (existing) return abortable(existing as Promise<T>, options.signal)

  const request = (async () => {
    let response: Response
    try {
      response = await fetch(key, { headers: { Accept: 'application/json' } })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      throw new ApiError('The Bonkey service could not be reached. Check your connection and try again.')
    }
    let envelope: unknown
    try {
      envelope = await response.json()
    } catch {
      throw new ApiError('The service returned an unreadable response.', response.status)
    }
    if (!envelope || typeof envelope !== 'object' || !('success' in envelope)) {
      throw new ApiError('The service returned an unexpected response.', response.status)
    }
    const result = envelope as ApiResponse<T>
    if (!response.ok || result.success !== true) {
      const fallback = response.status === 429
        ? 'Too many requests. Give the service a moment before trying again.'
        : 'message' in result && typeof result.message === 'string' ? result.message : 'The request failed.'
      throw new ApiError(fallback, response.status)
    }
    if (!('data' in result)) throw new ApiError('The response is missing its data payload.', response.status)
    if (options.ttl) cache.set(key, { expires: Date.now() + options.ttl, value: result.data })
    return result.data
  })().finally(() => pending.delete(key))

  pending.set(key, request)
  return abortable(request, options.signal)
}

export const endpoints = {
  home: (signal?: AbortSignal) => apiGet<unknown>('/api/home', { signal, ttl: 90_000 }),
  popular: (signal?: AbortSignal) => apiGet<unknown>('/api/popular', { signal, ttl: 90_000 }),
  ongoing: (signal?: AbortSignal) => apiGet<unknown>('/api/ongoing', { signal, ttl: 90_000 }),
  search: (query: string, page: number, signal?: AbortSignal) => apiGet<unknown>(`/api/search?q=${encodeURIComponent(query)}&page=${page}`, { signal }),
  taxonomy: (kind: 'type' | 'season' | 'genre', signal?: AbortSignal) => apiGet<unknown>(`/api/list-${kind}`, { signal, ttl: 10 * 60_000 }),
  catalog: (kind: 'type' | 'season' | 'genre', slug: string, page: number, signal?: AbortSignal) => apiGet<unknown>(`/api/${kind}/${encodeURIComponent(slug)}?page=${page}`, { signal, ttl: 90_000 }),
  collection: (kind: 'bd' | 'movie', page: number, signal?: AbortSignal) => apiGet<unknown>(`/api/${kind}?page=${page}`, { signal, ttl: 90_000 }),
  detail: (slug: string, signal?: AbortSignal) => apiGet<unknown>(`/api/watch/${encodeURIComponent(slug)}`, { signal, ttl: 60_000 }),
}
