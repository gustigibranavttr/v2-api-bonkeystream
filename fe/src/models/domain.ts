export interface ApiSuccess<T> {
  success: true
  statusCode: number
  message: string
  data: T
}

export interface ApiFailure {
  success: false
  statusCode: number
  message: string
  error?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export interface AnimeSummary {
  title: string
  slug: string
  thumb?: string
  rating?: string
  status?: string
  episode?: string
  latestEpisode?: number | null
  type?: string[]
  genres?: string[]
}

export interface TaxonomyItem {
  name: string
  slug: string
  count?: number
}

export interface Pagination {
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  totalPages?: number
}

export interface PaginatedAnime {
  results: AnimeSummary[]
  pagination: Pagination
}

export interface DownloadLink {
  name: string
  url: string
}

export interface DownloadQuality {
  quality?: string
  links: DownloadLink[]
}

export interface DownloadSection {
  title?: string
  qualities: DownloadQuality[]
}

export interface StreamSource {
  label: string
  quality?: number
  url: string
}

export interface StreamFormat {
  label: string
  quality?: number
  sources: StreamSource[]
}

export interface Episode {
  title: string
  formats: StreamFormat[]
}

export interface AnimeDetail extends AnimeSummary {
  synopsis?: string
  japaneseTitle?: string
  producers?: string[]
  duration?: string
  releaseDate?: string
  studio?: string
  episodes: Episode[]
  downloads: DownloadSection[]
}

export interface FavoriteRecord {
  slug: string
  title: string
  thumb?: string
  savedAt: string
}

export interface HistoryRecord {
  slug: string
  title: string
  thumb?: string
  episodeTitle: string
  episodeIndex: number
  currentTime: number
  duration: number
  progress: number
  completed: boolean
  preferredQuality?: string
  updatedAt: string
}

export interface Preferences {
  quality?: number
  reduceMotion: boolean
}
