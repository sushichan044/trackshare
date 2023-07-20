import Image from 'next/image'

import TweetButton from '@/components/share/tweetButton'
import { getNowPlayingTweet } from '@/lib/spotify'

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
}: {
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject
}) => {
  // check typeof track
  const thumbnail = getThumbnail(item)
  const tweet = getNowPlayingTweet(item)

  return (
    <div>
      <div className="flex items-center gap-x-4">
        <p>{item.name}</p>
        <TweetButton tweet={tweet} />
      </div>
      <div className="relative w-full aspect-square rounded-md">
        {thumbnail ? (
          <Image
            alt={item.name}
            className="rounded-md"
            fill
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
