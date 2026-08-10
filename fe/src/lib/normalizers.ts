import type {
  AnimeDetail,
  AnimeSummary,
  DownloadSection,
  Episode,
  PaginatedAnime,
  StreamFormat,
  TaxonomyItem,
} from '@/models/domain'

type UnknownRecord = Record<string, unknown>

export const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const text = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized || undefined
}

const list = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const values = value.map(text).filter((item): item is string => Boolean(item))
    return values.length ? values : undefined
  }
  const single = text(value)
  if (!single) return undefined
  const values = single.split(',').map((item) => item.trim()).filter(Boolean)
  return values.length ? values : undefined
}

export const isHttpUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const slugFrom = (value: UnknownRecord): string | undefined => {
  const direct = text(value.slug)
  if (direct) return direct.replace(/^\/+|\/+$/g, '').split('/').pop()
  const link = text(value.link)
  if (!link) return undefined
  try {
    return new URL(link, 'https://local.invalid').pathname.replace(/^\/+|\/+$/g, '').split('/').pop()
  } catch {
    return undefined
  }
}

export function normalizeSummary(value: unknown): AnimeSummary | null {
  if (!isRecord(value)) return null
  const title = text(value.title)
  const slug = slugFrom(value)
  if (!title || !slug) return null
  const latest = typeof value.latestEpisode === 'number' ? value.latestEpisode : null
  return {
    title,
    slug,
    thumb: isHttpUrl(value.thumb) ? value.thumb : isHttpUrl(value.thumbnail) ? value.thumbnail : undefined,
    rating: text(value.rating),
    status: text(value.status),
    episode: text(value.episode) ?? text(value.latestEpisode),
    latestEpisode: typeof value.latestEpisode === 'number' || value.latestEpisode === null ? latest : undefined,
    type: list(value.type),
    genres: list(value.genres ?? value.genre),
  }
}

export const normalizeSummaryList = (value: unknown): AnimeSummary[] =>
  (Array.isArray(value) ? value : []).map(normalizeSummary).filter((item): item is AnimeSummary => Boolean(item))

export function normalizeTaxonomy(value: unknown): TaxonomyItem[] {
  return (Array.isArray(value) ? value : []).flatMap((item) => {
    if (!isRecord(item)) return []
    const name = text(item.name ?? item.title)
    const slug = slugFrom(item)
    if (!name || !slug) return []
    return [{ name, slug, count: typeof item.count === 'number' ? item.count : undefined }]
  })
}

export function normalizePaginated(value: unknown): PaginatedAnime {
  const record = isRecord(value) ? value : {}
  const pagination = isRecord(record.pagination) ? record.pagination : {}
  const currentPage = Number(pagination.currentPage ?? pagination.current ?? 1)
  const totalPages = Number(pagination.totalPages ?? pagination.total ?? 0) || undefined
  return {
    results: normalizeSummaryList(record.results ?? record.data ?? value),
    pagination: {
      currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
      hasNextPage: Boolean(pagination.hasNextPage ?? pagination.nextPage ?? (totalPages && currentPage < totalPages)),
      hasPrevPage: Boolean(pagination.hasPrevPage ?? pagination.prevPage ?? currentPage > 1),
      totalPages,
    },
  }
}

function qualityNumber(label: string): number | undefined {
  const match = label.match(/(\d{3,4})/)
  return match ? Number(match[1]) : undefined
}

function normalizeFormats(value: unknown): StreamFormat[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((raw, formatIndex) => {
    if (!isRecord(raw)) return []
    const label = text(raw.format ?? raw.quality ?? raw.label) ?? `Source ${formatIndex + 1}`
    const urls = Array.isArray(raw.url) ? raw.url : Array.isArray(raw.urls) ? raw.urls : [raw.url ?? raw.src]
    const sources = urls.filter(isHttpUrl).map((url, sourceIndex) => ({
      label: urls.length > 1 ? `Server ${sourceIndex + 1}` : label,
      quality: qualityNumber(label),
      url,
    }))
    return sources.length ? [{ label, quality: qualityNumber(label), sources }] : []
  })
}

function normalizeEpisodes(value: unknown): Episode[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((raw, index) => {
    if (!isRecord(raw)) return []
    const title = text(raw.title ?? raw.episode) ?? `Episode ${index + 1}`
    const formats = normalizeFormats(raw.stream ?? raw.streams ?? raw.data ?? raw.sources)
    return formats.length ? [{ title, formats }] : []
  })
}

function normalizeDownloads(value: unknown): DownloadSection[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((raw) => {
    if (!isRecord(raw)) return []
    const rawQualities = Array.isArray(raw.qualities) ? raw.qualities : [raw]
    const qualities = rawQualities.flatMap((rawQuality) => {
      if (!isRecord(rawQuality) || !Array.isArray(rawQuality.links)) return []
      const links = rawQuality.links.flatMap((rawLink) => {
        if (!isRecord(rawLink) || !isHttpUrl(rawLink.url)) return []
        return [{ name: text(rawLink.name) ?? 'Download', url: rawLink.url }]
      })
      return links.length ? [{ quality: text(rawQuality.quality), links }] : []
    })
    return qualities.length ? [{ title: text(raw.title), qualities }] : []
  })
}

export function normalizeDetail(value: unknown, requestedSlug: string): AnimeDetail {
  const record = isRecord(value) ? value : {}
  const info = isRecord(record.info) ? record.info : {}
  const infoValue = (...keys: string[]) => {
    for (const key of keys) {
      const match = Object.entries(info).find(([candidate]) => candidate.toLowerCase() === key.toLowerCase())
      const value = text(match?.[1])
      if (value) return value
    }
    return undefined
  }
  const summary = normalizeSummary({ ...record, slug: slugFrom(record) ?? requestedSlug }) ?? {
    title: text(record.title) ?? requestedSlug.replace(/-/g, ' '),
    slug: requestedSlug,
  }
  return {
    ...summary,
    synopsis: text(record.synopsis ?? record.description),
    rating: summary.rating ?? infoValue('Score', 'Rating'),
    status: summary.status ?? infoValue('Status'),
    japaneseTitle: text(record.japaneseTitle ?? record.japanese) ?? infoValue('Japanese', 'Japanese Title'),
    producers: list(record.producers) ?? list(infoValue('Producers', 'Producer')),
    duration: text(record.duration) ?? infoValue('Duration'),
    releaseDate: text(record.releaseDate ?? record.released) ?? infoValue('Aired', 'Released', 'Release Date'),
    studio: text(record.studio) ?? infoValue('Studios', 'Studio'),
    episodes: normalizeEpisodes(record.episodes ?? record.episodeList),
    downloads: normalizeDownloads(record.downloads),
  }
}

export function closestFormat(formats: StreamFormat[], preferred = 720): StreamFormat | undefined {
  const numeric = formats.filter((format) => typeof format.quality === 'number')
  return numeric.sort((a, b) => {
    const distance = Math.abs((a.quality ?? 0) - preferred) - Math.abs((b.quality ?? 0) - preferred)
    return distance || (a.quality ?? 0) - (b.quality ?? 0)
  })[0] ?? formats[0]
}
