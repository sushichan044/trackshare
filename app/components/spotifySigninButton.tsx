import { SignInButton } from '@clerk/nextjs'
import { FaSpotify } from 'react-icons/fa6'

import Button from '@/components/common/button'

const SpotifySigninButton = () => {
  return (
    <SignInButton mode="modal">
      <Button className="flex flex-row gap-x-2">
        <span className="flex items-center justify-center h-full">
          <FaSpotify />
        </span>
        Sign in with Spotify
      </Button>
    </SignInButton>
  )
}

export default SpotifySigninButton
