import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'
import { IoMdRefresh } from 'react-icons/io'

import RefreshButton from '@/components/refresh'
import Item from '@/components/spotify/item'
import { getUserSpotifyAccessToken, SpotifyClient } from '@/lib/spotify'

const NowPlayingBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>loading track data...</div>}>
      <div>
        <div className="flex flex-row items-center gap-x-2">
          <h2 className="my-0">Get NowPlaying</h2>
          <RefreshButton
            aria-label="refresh NowPlaying"
            className="flex items-center justify-center"
            title="refresh NowPlaying"
          >
            <IoMdRefresh size="1.5rem" />
          </RefreshButton>
        </div>
        <div />
        {children}
      </div>
    </Suspense>
  )
}

const NowPlaying = async () => {
  const user = await currentUser()
  if (!user) return <></>

  const tokens = await getUserSpotifyAccessToken(user.id)
  const spotify = new SpotifyClient(tokens[0].token)
  const res = await spotify.getCurrentlyPlaying()
  if (!res.ok) {
    return (
      <NowPlayingBase>
        <div>error</div>
      </NowPlayingBase>
    )
  }
  if (res.isEmpty) {
    return (
      <NowPlayingBase>
        <div>You are not playing any music now...</div>
      </NowPlayingBase>
    )
  }
  const track = res.data

  if (!track.item) {
    return (
      <NowPlayingBase>
        <div>error</div>
      </NowPlayingBase>
    )
  }

  return (
    <NowPlayingBase>
      <Item item={track.item} />
    </NowPlayingBase>
  )
}

export default NowPlaying
