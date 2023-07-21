import { FaSpotify } from 'react-icons/fa6'

import Link from '@/components/common/link'

const SpotifyButton = ({ url }: { url: string }) => {
  return (
    // @ts-expect-error href is string
    <Link href={url} title="view on Spotify">
      <FaSpotify />
    </Link>
  )
}

export default SpotifyButton
