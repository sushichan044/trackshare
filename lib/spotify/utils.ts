import { clerkClient } from '@clerk/nextjs'

async function getUserSpotifyAccessToken(userId: string) {
  const tokens = await clerkClient.users.getUserOauthAccessToken(
    userId,
    'oauth_spotify'
  )
  return tokens
}

const getNowPlayingTweet = ({
  itemInfo,
  url,
}: {
  itemInfo: ItemInfo
  url: string
}): string => {
  const { type, ...rest } = itemInfo
  if (type == 'unknown') {
    return ''
  }
  return `#NowPlaying\n${rest.formatted}\n${url}`
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

export { getUserSpotifyAccessToken, getItemInfo, getNowPlayingTweet }
