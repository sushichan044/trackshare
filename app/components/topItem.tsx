import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

import Item from '@/components/spotify/item'
import { getUserSpotifyAccessToken, SpotifyClient } from '@/lib/spotify'

const TopItem = async () => {
  const user = await currentUser()
  if (!user) return <></>

  const tokens = await getUserSpotifyAccessToken(user.id)
  const spotify = new SpotifyClient(tokens[0].token)
  const res = await spotify.getTopTracks({
    timeRange: 'short_term',
    limit: 10,
  })
  if (!res.ok) {
    return <div>error</div>
  }
  const tracks = res.data
  return (
    <Suspense fallback={<div>loading</div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.items.map((track) => (
          <Item item={track} key={track.id} />
        ))}
      </div>
    </Suspense>
  )
}

export default TopItem
