import type { IDeezerAlbumResult, IDeezerAlbumTrack, IDeezerResponse } from '@/types/deezer'
import { createNotAvailableError, ensureDeezer, getOrFetch } from './get-or-fetch'

async function findAlbumTracks(query: string): Promise<IDeezerAlbumTrack[] | undefined> {
  if (!query.trim()) throw createNotAvailableError('Search query is empty')

  return getOrFetch(`album-tracks:${query}`, async () => {
    const searchResponse = await fetch(`/api/deezer/search/album?q=${encodeURIComponent(query)}`)
    const searchData = (await searchResponse.json()) as IDeezerResponse<IDeezerAlbumResult>
    const album = searchData.data?.[0]
    if (!album) return undefined

    const tracksResponse = await fetch(`/api/deezer/album/${album.id}/tracks`)
    const tracksData = (await tracksResponse.json()) as IDeezerResponse<IDeezerAlbumTrack>
    const tracks = tracksData.data
    if (!tracks?.length) return undefined

    return tracks
  })
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export async function getAlbumTracks(service: string, query: string): Promise<string[][]> {
  ensureDeezer(service)

  const tracks = await findAlbumTracks(query)
  if (!tracks) throw createNotAvailableError('Album not found')

  return tracks.map((track) => [
    String(track.track_position),
    track.title,
    track.artist.name,
    formatDuration(track.duration),
    track.isrc,
  ])
}
