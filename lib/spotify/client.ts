import queryString from 'query-string'

import { doFetch, FetchResponse } from '@/lib/fetch'
import { mergeRecords } from '@/utils/record'

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
export { SpotifyClient }
