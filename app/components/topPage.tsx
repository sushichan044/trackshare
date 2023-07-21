import { currentUser } from '@clerk/nextjs'

import NowPlaying from '@/app/components/nowPlaying'
import SpotifySigninButton from '@/app/components/spotifySigninButton'
import TopItem from '@/app/components/topItem'
export default async function TopPage() {
  const user = await currentUser()
  console.log(user)

  return (
    <>
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
    </>
  )
}
