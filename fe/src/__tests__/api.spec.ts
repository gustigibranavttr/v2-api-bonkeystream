import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError, apiGet } from '@/lib/api'

afterEach(() => vi.unstubAllGlobals())

describe('API client', () => {
  it('deduplicates simultaneous requests for the same resource', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      statusCode: 200,
      message: 'ok',
      data: ['result'],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)

    const [first, second] = await Promise.all([
      apiGet<string[]>('/api/test-dedupe'),
      apiGet<string[]>('/api/test-dedupe'),
    ])

    expect(first).toEqual(['result'])
    expect(second).toEqual(['result'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('branches on a failure envelope without requiring data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      statusCode: 429,
      message: 'Rate limited',
    }), { status: 429, headers: { 'Content-Type': 'application/json' } })))

    await expect(apiGet('/api/test-failure')).rejects.toEqual(expect.objectContaining<ApiError>({
      status: 429,
      message: 'Too many requests. Give the service a moment before trying again.',
    }))
  })
})
