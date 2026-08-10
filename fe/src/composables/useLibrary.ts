import { computed } from 'vue'

import { persistentRef } from '@/lib/storage'
import type { AnimeSummary, FavoriteRecord, HistoryRecord, Preferences } from '@/models/domain'

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const timestamp = (value: unknown) => typeof value === 'string' && !Number.isNaN(Date.parse(value))
  ? value
  : typeof value === 'number' ? new Date(value).toISOString() : new Date().toISOString()

const sanitizeFavorites = (value: unknown): FavoriteRecord[] | undefined => Array.isArray(value) ? value.flatMap((item) => {
  if (!record(item) || typeof item.slug !== 'string' || typeof item.title !== 'string') return []
  return [{ slug: item.slug, title: item.title, thumb: typeof item.thumb === 'string' ? item.thumb : undefined, savedAt: timestamp(item.savedAt) }]
}) : undefined

const sanitizeHistory = (value: unknown): HistoryRecord[] | undefined => Array.isArray(value) ? value.flatMap((item) => {
  if (!record(item) || typeof item.slug !== 'string' || typeof item.title !== 'string' || typeof item.episodeTitle !== 'string') return []
  const currentTime = typeof item.currentTime === 'number' ? item.currentTime : 0
  const duration = typeof item.duration === 'number' ? item.duration : 0
  return [{
    slug: item.slug,
    title: item.title,
    thumb: typeof item.thumb === 'string' ? item.thumb : undefined,
    episodeTitle: item.episodeTitle,
    episodeIndex: typeof item.episodeIndex === 'number' ? item.episodeIndex : 1,
    currentTime,
    duration,
    progress: typeof item.progress === 'number' ? item.progress : duration > 0 ? currentTime / duration : 0,
    completed: item.completed === true,
    preferredQuality: typeof item.preferredQuality === 'string' ? item.preferredQuality : undefined,
    updatedAt: timestamp(item.updatedAt),
  }]
}).slice(0, 100) : undefined

const sanitizePreferences = (value: unknown): Preferences | undefined => record(value)
  ? { quality: typeof value.quality === 'number' ? value.quality : undefined, reduceMotion: value.reduceMotion === true }
  : undefined

const favorites = persistentRef<FavoriteRecord[]>('bonkey:v2:favorites', [], { legacyKeys: ['bonkey:favorites'], sanitize: sanitizeFavorites })
const history = persistentRef<HistoryRecord[]>('bonkey:v2:history', [], { legacyKeys: ['bonkey:history'], sanitize: sanitizeHistory })
const preferences = persistentRef<Preferences>('bonkey:v2:preferences', { reduceMotion: false }, { legacyKeys: ['bonkey:preferences'], sanitize: sanitizePreferences })

export function useFavorites() {
  const has = (slug: string) => favorites.value.some((item) => item.slug === slug)
  const restore = (item: FavoriteRecord) => {
    favorites.value = [item, ...favorites.value.filter((favorite) => favorite.slug !== item.slug)]
  }
  const toggle = (anime: AnimeSummary) => {
    const existing = favorites.value.find((item) => item.slug === anime.slug)
    favorites.value = existing
      ? favorites.value.filter((item) => item.slug !== anime.slug)
      : [{ slug: anime.slug, title: anime.title, thumb: anime.thumb, savedAt: new Date().toISOString() }, ...favorites.value]
    return !existing
  }
  const remove = (slug: string) => { favorites.value = favorites.value.filter((item) => item.slug !== slug) }
  return { favorites: computed(() => favorites.value), has, toggle, remove, restore }
}

export function useHistory() {
  const sortedHistory = computed(() => [...history.value].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)))
  const find = (slug: string) => history.value.find((item) => item.slug === slug)
  const save = (record: HistoryRecord) => {
    history.value = [record, ...history.value.filter((item) => item.slug !== record.slug)]
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 100)
  }
  const remove = (slug: string) => { history.value = history.value.filter((item) => item.slug !== slug) }
  const clear = () => { history.value = [] }
  return { history: sortedHistory, find, save, remove, clear }
}

export function usePreferences() {
  const setQuality = (quality?: number) => { preferences.value.quality = quality }
  return { preferences, setQuality }
}
