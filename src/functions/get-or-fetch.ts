const cache = new Map<string, unknown>()
const pendingRequests = new Map<string, Promise<unknown>>()

export async function getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T

  const pending = pendingRequests.get(key) as Promise<T> | undefined
  if (pending) return pending

  const promise = fetcher().then((result) => {
    if (result !== undefined) cache.set(key, result)
    pendingRequests.delete(key)
    return result
  })

  pendingRequests.set(key, promise)
  return promise
}

export function clearCache(): void {
  cache.clear()
  pendingRequests.clear()
}

export function createNotAvailableError(message: string): CustomFunctions.Error {
  return new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, message)
}

export function ensureDeezer(service: string): void {
  if (service.toLowerCase() !== 'deezer') {
    throw createNotAvailableError('Only "deezer" service is supported')
  }
}
