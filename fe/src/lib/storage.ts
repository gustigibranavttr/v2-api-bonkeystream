import { ref, watch, type Ref } from 'vue'

interface StoredValue<T> { version: 2; data: T }
interface PersistenceOptions<T> {
  legacyKeys?: string[]
  sanitize?: (value: unknown) => T | undefined
}

export function persistentRef<T>(key: string, fallback: T, options: PersistenceOptions<T> = {}): Ref<T> {
  const storage = () => {
    try { return typeof window !== 'undefined' ? window.localStorage : undefined }
    catch { return undefined }
  }
  const decode = (raw: string | null): T | undefined => {
    if (!raw) return undefined
    try {
      const parsed = JSON.parse(raw) as unknown
      const candidate = typeof parsed === 'object' && parsed !== null && 'data' in parsed
        ? (parsed as { data: unknown }).data
        : parsed
      return options.sanitize ? options.sanitize(candidate) : candidate as T
    } catch { return undefined }
  }
  const read = () => {
    try {
      for (const candidateKey of [key, ...(options.legacyKeys ?? [])]) {
        const value = decode(storage()?.getItem(candidateKey) ?? null)
        if (value !== undefined) return value
      }
    } catch { /* storage can be unavailable */ }
    return fallback
  }
  const initial = read()
  const state = ref(initial) as Ref<T>
  watch(state, (value) => {
    try { storage()?.setItem(key, JSON.stringify({ version: 2, data: value } satisfies StoredValue<T>)) } catch { /* storage may be unavailable */ }
  }, { deep: true })

  const sync = (event: StorageEvent) => {
    if (event.key !== key) return
    const value = decode(event.newValue)
    state.value = value ?? fallback
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', sync)
  }
  return state
}
