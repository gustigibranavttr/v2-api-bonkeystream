import { describe, expect, it } from 'vitest'

import { buildResolvedStreamUrl } from '@/lib/streamResolver'

describe('stream resolver URL', () => {
  it('routes a stream source through the configured resolver', () => {
    expect(buildResolvedStreamUrl(
      'https://stordl.halahgan.com/streaming//MtkRYD',
      'https://v2-api-bonkeystream.vercel.app',
    )).toBe(
      'https://v2-api-bonkeystream.vercel.app/api/resolve?url=https%3A%2F%2Fstordl.halahgan.com%2Fstreaming%2F%2FMtkRYD',
    )
  })

  it('encodes a complete source query exactly once and removes a trailing API slash', () => {
    const source = 'https://stordl.halahgan.com/streaming//MtkRYD?name=[Nimegami]_Episode 01_(1080p).mp4'
    const result = buildResolvedStreamUrl(source, 'https://api.example.test/')

    expect(result).toBe(`https://api.example.test/api/resolve?url=${encodeURIComponent(source)}`)
    expect(result).not.toContain('%253A')
    expect(new URL(result).searchParams.get('url')).toBe(source)
  })
})
