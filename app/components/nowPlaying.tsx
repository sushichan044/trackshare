import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

import Item from '@/components/spotify/item'
import { getUserSpotifyAccessToken, SpotifyClient } from '@/lib/spotify'

const NowPlaying = async () => {
  const user = await currentUser()
  if (!user) return <></>

  const tokens = await getUserSpotifyAccessToken(user.id)
  const spotify = new SpotifyClient(tokens[0].token)
  const res = await spotify.getCurrentlyPlaying()
  if (!res.ok) {
    return <div>error</div>
  }
  if (res.isEmpty) {
    return <div>You are not playing any music now...</div>
  }
  const track = res.data

  if (!track.item) {
    return <div>no item</div>
  }

  return (
    <Suspense fallback={<div>loading track data...</div>}>
      <Item item={track.item} />
    </Suspense>
  )
}

export default NowPlaying
