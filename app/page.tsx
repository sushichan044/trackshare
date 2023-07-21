import { currentUser } from '@clerk/nextjs'

import NowPlaying from '@/app/components/nowPlaying'
import SpotifySigninButton from '@/app/components/spotifySigninButton'
import TopItem from '@/app/components/topItem'
import MainContainer from '@/components/common/mainContainer'
export default async function Home() {
  const user = await currentUser()

  return (
    <MainContainer>
      <h1 className="text-4xl text-center">Share Track</h1>
      {user ? (
        <>
          <NowPlaying />
          <h2>Your Top Items</h2>
          <TopItem />
        </>
      ) : (
        <div className="flex mt-8">
          <SpotifySigninButton />
        </div>
      )}
    </MainContainer>
  )
}
