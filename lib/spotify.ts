import { clerkClient } from '@clerk/nextjs'

import { doFetch, type FetchResponse, mergeUrlAndParams } from '@/lib/fetch'
import { mergeRecords } from '@/utils/record'

type spotifyElementData = {
  id: string
  type: 'track' | 'artist' | 'album' | 'playlist' | 'show' | 'episode' | 'user'
}

type fetchOptions = {
  params: Record<string, string>
  nextConfig?: NextFetchRequestConfig
}

async function getUserSpotifyAccessToken(userId: string) {
  const tokens = await clerkClient.users.getUserOauthAccessToken(
    userId,
    'oauth_spotify'
  )
  return tokens
}

class SpotifyClient {
  private static readonly API_URL = 'https://api.spotify.com/v1'
  private static readonly BASE_PARAMS = {
    // market: 'JP',
    // locale: 'ja_JP',
  }

  constructor(private accessToken: string) {}

  private async fetch<T>(
    endpoint: string,
    { params, nextConfig }: fetchOptions
  ): Promise<FetchResponse<T>> {
    const fullParams = mergeRecords(SpotifyClient.BASE_PARAMS, params)
    const baseUrl = `${SpotifyClient.API_URL}/${endpoint}`
    const url = mergeUrlAndParams(baseUrl, fullParams)

    const res = await doFetch<T>(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      next: nextConfig,
    })
    return res
  }

  private async getTop<T>({
    type,
    timeRange = 'medium_term',
    limit = '10',
    offset = '5',
  }: {
    type: 'tracks' | 'artists'
    timeRange?: 'long_term' | 'medium_term' | 'short_term'
    limit?: string
    offset?: string
  }) {
    const res = await this.fetch<T>(`me/top/${type}`, {
      params: {
        time_range: timeRange,
        limit,
        offset,
      },
    })
    return res
  }

  public async getTopTracks({
    timeRange = 'medium_term',
    limit = 10,
    offset = 5,
  }: {
    timeRange?: 'long_term' | 'medium_term' | 'short_term'
    limit?: number
    offset?: number
  }) {
    const res = await this.getTop<SpotifyApi.UsersTopTracksResponse>({
      type: 'tracks',
      timeRange,
      limit: limit.toString(),
      offset: offset.toString(),
    })
    return res
  }

  public async getTopArtists({
    timeRange = 'medium_term',
    limit = 10,
    offset = 5,
  }: {
    timeRange?: 'long_term' | 'medium_term' | 'short_term'
    limit?: number
    offset?: number
  }) {
    const res = await this.getTop<SpotifyApi.UsersTopArtistsResponse>({
      type: 'artists',
      timeRange,
      limit: limit.toString(),
      offset: offset.toString(),
    })
    return res
  }

  public async getCurrentlyPlaying() {
    const res = await this.fetch<SpotifyApi.CurrentlyPlayingResponse>(
      'me/player/currently-playing',
      {
        params: {
          market: 'JP',
          locale: 'ja_JP',
        },
      }
    )
    return res
  }

  public async getTrack(
    trackUrl: string
  ): Promise<FetchResponse<SpotifyApi.SingleTrackResponse>> {
    const { id, type } = this.extractElementData(trackUrl)
    if (type !== 'track') {
      return {
        ok: false,
        error: 'Invalid track url',
        status: 400,
        raw: null,
        isEmpty: false,
      }
    }

    const res = await this.fetch<SpotifyApi.SingleTrackResponse>(
      `tracks/${id}`,
      {
        params: {
          market: 'JP',
          locale: 'ja_JP',
        },
      }
    )
    return res
  }

  private extractElementData(trackUrl: string): spotifyElementData {
    const regexp =
      /^(http[s]?:\/\/)s?open.spotify.com\/((?<region>[0-9A-Za-z\-]+)\/)?(?<type>track|artist|album|playlist|show|episode|user)\/(?<id>[0-9A-Za-z]+)(\?.*)?$/
    const match = trackUrl.match(regexp)
    if (!match) {
      throw new Error('Invalid track url')
    }
    return {
      id: match.groups?.id ?? '',
      type: match.groups?.type as spotifyElementData['type'],
    }
  }
}

const getNowPlayingTweet = (
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject
) => {
  const url = item.external_urls.spotify
  const itemInfo = getItemInfo(item)

  return `#NowPlaying
${itemInfo}
${url}
`
}

const getItemInfo = (
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject
) => {
  if (item.type == 'track') {
    const name = item.name
    const artists = item.artists.map((artist) => artist.name).join(', ')
    const album =
      item.album.name && item.album.name != '' ? item.album.name : null
    return `${name} / ${artists}` + (album ? ` - ${album}` : '')
  }
  if (item.type == 'episode') {
    const name = item.name
    const show = item.show.name
    return `${name} / ${show}`
  }
  return ''
}

export { SpotifyClient, getUserSpotifyAccessToken, getNowPlayingTweet }
