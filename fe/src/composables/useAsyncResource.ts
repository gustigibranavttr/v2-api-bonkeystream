import { onBeforeUnmount, ref, type Ref } from 'vue'

export function useAsyncResource<T>() {
  const data = ref<T>() as Ref<T | undefined>
  const loading = ref(false)
  const error = ref('')
  let controller: AbortController | undefined

  async function load(loader: (signal: AbortSignal) => Promise<T>) {
    controller?.abort()
    controller = new AbortController()
    loading.value = true
    error.value = ''
    try {
      data.value = await loader(controller.signal)
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === 'AbortError')) {
        error.value = caught instanceof Error ? caught.message : 'Something went wrong.'
      }
    } finally {
      if (!controller.signal.aborted) loading.value = false
    }
  }

  onBeforeUnmount(() => controller?.abort())
  return { data, loading, error, load }
}
