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
