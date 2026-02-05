import { getTrackByIsrc } from './get-track-by-isrc'
import { getAlbumTracks } from './get-album-tracks'
import { getTrackInfo } from './get-track-info'

CustomFunctions.associate('ISRC', getTrackByIsrc)
CustomFunctions.associate('ALBUM', getAlbumTracks)
CustomFunctions.associate('TRACK', getTrackInfo)
