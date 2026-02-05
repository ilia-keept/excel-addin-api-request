import type { IDeezerResponse, IDeezerTrack, IDeezerTrackDetail } from '@/types/deezer'
import { createNotAvailableError, ensureDeezer, getOrFetch } from './get-or-fetch'

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

async function findTrackByQuery(query: string): Promise<IDeezerTrack | undefined> {
  if (!query.trim()) throw createNotAvailableError('Search query is empty')

  return getOrFetch(`search-track:${query}`, async () => {
    const response = await fetch(`/api/deezer/search/track?q=${encodeURIComponent(query)}`)
    const data = (await response.json()) as IDeezerResponse<IDeezerTrack>
    return data.data?.[0] ?? undefined
  })
}

async function findTrackById(id: number): Promise<IDeezerTrackDetail | undefined> {
  return getOrFetch(`track:${id}`, async () => {
    const response = await fetch(`/api/deezer/track/${id}`)
    const data: Record<string, unknown> = await response.json()

    if (data.error) return undefined

    return data as unknown as IDeezerTrackDetail
  })
}

export async function getTrackInfo(service: string, query: string): Promise<string[][]> {
  ensureDeezer(service)

  const track = await findTrackByQuery(query)
  if (!track) throw createNotAvailableError('Track not found')

  const detail = await findTrackById(track.id)
  if (!detail) throw createNotAvailableError('Track details not available')

  return [
    ['Title', detail.title],
    ['Artist', detail.artist.name],
    ['Album', detail.album.title],
    ['ISRC', detail.isrc],
    ['Duration', formatDuration(detail.duration)],
    ['Release Date', detail.release_date],
    ['BPM', String(detail.bpm)],
    ['Rank', String(detail.rank)],
    ['Link', detail.link],
    ['Explicit', detail.explicit_lyrics ? 'Yes' : 'No'],
  ]
}
