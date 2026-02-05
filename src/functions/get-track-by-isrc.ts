import type { IDeezerTrack } from '@/types/deezer'
import { createNotAvailableError, ensureDeezer, getOrFetch } from './get-or-fetch'

async function findTrackByIsrc(isrc: string): Promise<IDeezerTrack | undefined> {
  if (!isrc.trim()) throw createNotAvailableError('ISRC is empty')

  return getOrFetch(`isrc:${isrc}`, async () => {
    const response = await fetch(`/api/deezer/track/isrc:${encodeURIComponent(isrc)}`)
    const data: Record<string, unknown> = await response.json()

    if (data.error) return undefined

    return data as unknown as IDeezerTrack
  })
}

export async function getTrackByIsrc(service: string, isrc: string): Promise<string> {
  ensureDeezer(service)

  const track = await findTrackByIsrc(isrc)
  if (!track) throw createNotAvailableError('Track not found')

  return `${track.artist.name} - ${track.title}`
}
