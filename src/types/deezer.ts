export interface IDeezerArtist {
  id: number
  name: string
}

export interface IDeezerAlbum {
  id: number
  title: string
}

// Base track fields returned by all track endpoints
export interface IDeezerTrackBase {
  id: number
  title: string
  isrc: string
  artist: IDeezerArtist
}

// Search result — minimal track with album reference
export interface IDeezerTrack extends IDeezerTrackBase {
  album: IDeezerAlbum
}

// Album tracklist item — adds playback/position details, no album (implicit)
export interface IDeezerAlbumTrack extends IDeezerTrackBase {
  title_short: string
  duration: number
  track_position: number
  disk_number: number
  rank: number
  explicit_lyrics: boolean
}

// Full track detail — extends album track with metadata and album reference
export interface IDeezerTrackDetail extends IDeezerAlbumTrack {
  link: string
  release_date: string
  bpm: number
  gain: number
  preview: string
  album: IDeezerAlbum
}

// Album search result — extends album with track count and artist
export interface IDeezerAlbumResult extends IDeezerAlbum {
  nb_tracks: number
  artist: IDeezerArtist
}

// Generic response wrapper for all Deezer list endpoints
export interface IDeezerResponse<TData> {
  data: TData[]
  total?: number
}
