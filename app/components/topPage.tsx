import { SignedIn, SignedOut } from '@clerk/nextjs'

import NowPlaying from '@/app/components/nowPlaying'
import SpotifySigninButton from '@/app/components/spotifySigninButton'
import TopItem from '@/app/components/topItem'
export default async function TopPage() {
  return (
    <>
      <SignedIn>
        <NowPlaying />
        <h2>Your Top Items</h2>
        <TopItem />
      </SignedIn>
      <SignedOut>
        {' '}
        <div className="flex mt-8">
          <SpotifySigninButton />
        </div>
      </SignedOut>
    </>
  )
}
