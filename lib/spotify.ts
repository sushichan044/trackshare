import { clerkClient } from '@clerk/nextjs'
import queryString from 'query-string'

import { doFetch, type FetchResponse } from '@/lib/fetch'
import { mergeRecords } from '@/utils/record'

type spotifyElementData = {
  id: string
  type: 'track' | 'artist' | 'album' | 'playlist' | 'show' | 'episode' | 'user'
}

type fetchOptions = {
  params: Record<string, string>
  nextConfig?: NextFetchRequestConfig
}

type ItemInfo =
  | {
      name: string
      formatted: string
      shortFormatted: string
    } & (
      | {
          artists: string[]
          album: string | null
          type: 'track'
        }
      | {
          show: string
          type: 'episode'
        }
      | {
          type: 'unknown'
        }
    )

async function getUserSpotifyAccessToken(userId: string) {
  const tokens = await clerkClient.users.getUserOauthAccessToken(
    userId,
    'oauth_spotify'
  )
  return tokens
}

class SpotifyClient {
  private static readonly API_URL = new URL('https://api.spotify.com/v1/')
  private static readonly BASE_PARAMS = {
    // market: 'JP',
    // locale: 'ja_JP',
  }

  constructor(private accessToken: string) {}

  private async fetch<T>(
    endpoint: string,
    { params, nextConfig }: fetchOptions
  ): Promise<FetchResponse<T>> {
    const apiUrl = new URL(endpoint, SpotifyClient.API_URL)
    const fullParams = mergeRecords(SpotifyClient.BASE_PARAMS, params)
    const url = queryString.stringifyUrl({
      url: apiUrl.toString(),
      query: fullParams,
    })

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

const getNowPlayingTweet = ({ itemInfo }: { itemInfo: ItemInfo }): string => {
  const { type, ...rest } = itemInfo
  if (type == 'unknown') {
    return ''
  }
  return `#NowPlaying\n${rest.formatted}`
}

const getItemInfo = (
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject
): ItemInfo => {
  if (item.type == 'track') {
    const name = item.name
    const artists = item.artists.map((artist) => artist.name)
    const album =
      item.album.name && item.album.name != '' ? item.album.name : null
    return {
      name,
      artists,
      album,
      type: 'track',
      formatted:
        `${name} / ${artists.join(', ')}` + (album ? ` - ${album}` : ''),
      shortFormatted: `${name} / ${artists[0]}`,
    }
  }
  if (item.type == 'episode') {
    const name = item.name
    const show = item.show.name
    return {
      name,
      show,
      type: 'episode',
      formatted: `${name} / ${show}`,
      shortFormatted: `${name} / ${show}`,
    }
  }
  return {
    name: '',
    type: 'unknown',
    formatted: 'Unknown',
    shortFormatted: 'Unknown',
  }
}

export {
  SpotifyClient,
  getUserSpotifyAccessToken,
  getNowPlayingTweet,
  getItemInfo,
}
