import Image from 'next/image'

import CopyToClipboardButton from '@/components/share/clipBoardButton'
import SpotifyButton from '@/components/share/spotifyButton'
import TweetButton from '@/components/share/tweetButton'
import { getItemInfo, getNowPlayingTweet } from '@/lib/spotify'

const getThumbnail = (
  track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject
) => {
  switch (track.type) {
    case 'track':
      return track.album.images[0]
    case 'episode':
      return track.images[0]
    default:
      return null
  }
}

const Item = ({
  item,
  priority = false,
}: {
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject
  priority?: boolean
}) => {
  // check typeof track
  const thumbnail = getThumbnail(item)
  const url = item.external_urls.spotify
  const itemInfo = getItemInfo(item)
  const tweet = getNowPlayingTweet({ url, itemInfo })

  return (
    <div>
      <div className="flex items-center gap-x-4">
        <p>{itemInfo.shortFormatted}</p>
        <SpotifyButton url={url} />
        <TweetButton tweet={tweet} />
        <CopyToClipboardButton text={tweet} />
      </div>
      <div className="relative w-full aspect-square rounded-md">
        {thumbnail ? (
          <Image
            alt={item.name}
            className="rounded-md"
            fill
            priority={priority}
            src={thumbnail.url}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          'no thumbnail'
        )}
        T
      </div>
    </div>
  )
}

export default Item
