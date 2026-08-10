import { describe, expect, it } from 'vitest'

import { closestFormat, normalizeDetail, normalizePaginated } from '@/lib/normalizers'

describe('API normalizers', () => {
  it('preserves nested download groups and rejects unsafe links', () => {
    const detail = normalizeDetail({
      title: 'Yomi no Tsugai',
      slug: 'yomi-no-tsugai-sub-indo',
      downloads: [{
        title: 'Episode 18',
        qualities: [{ quality: '720p', links: [
          { name: 'Berkasdrive', url: 'https://example.com/file' },
          { name: 'Unsafe', url: 'javascript:alert(1)' },
        ] }],
      }],
    }, 'fallback')

    expect(detail.downloads).toEqual([{ title: 'Episode 18', qualities: [{
      quality: '720p', links: [{ name: 'Berkasdrive', url: 'https://example.com/file' }],
    }] }])
  })

  it('keeps only episodes with validated playback candidates', () => {
    const detail = normalizeDetail({
      title: 'Playback Test',
      episodes: [
        { title: 'Episode 1', streams: [{ format: '720p', url: ['https://cdn.test/a.mp4', 'not-a-url'] }] },
        { title: 'Episode 2', streams: [{ format: '1080p', url: [] }] },
      ],
    }, 'playback-test')

    expect(detail.episodes).toHaveLength(1)
    expect(detail.episodes[0]?.formats[0]?.sources).toHaveLength(1)
    expect(detail.episodes[0]?.formats[0]?.quality).toBe(720)
  })

  it('chooses the lower quality when nearest-quality distances tie', () => {
    const formats = [
      { label: '1080p', quality: 1080, sources: [{ label: '1080p', quality: 1080, url: 'https://cdn.test/1080.mp4' }] },
      { label: '360p', quality: 360, sources: [{ label: '360p', quality: 360, url: 'https://cdn.test/360.mp4' }] },
    ]
    expect(closestFormat(formats, 720)?.quality).toBe(360)
  })

  it('derives pagination adjacency from total pages', () => {
    const page = normalizePaginated({ results: [], pagination: { currentPage: 2, totalPages: 3 } })
    expect(page.pagination).toMatchObject({ currentPage: 2, hasNextPage: true, hasPrevPage: true, totalPages: 3 })
  })
})
