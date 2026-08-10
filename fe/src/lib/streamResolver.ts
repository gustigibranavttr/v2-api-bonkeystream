import { API_BASE } from '@/lib/api'

export function buildResolvedStreamUrl(sourceUrl: string, apiBase = API_BASE): string {
  const normalizedBase = apiBase.replace(/\/$/, '')
  return `${normalizedBase}/api/resolve?url=${encodeURIComponent(sourceUrl)}`
}
