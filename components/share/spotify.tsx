import React from 'react'

import Link from '@/components/common/link'

const SpotifyButton = ({
  url,
  children,
}: {
  url: string
  children: React.ReactNode
}) => {
  return (
    // @ts-expect-error href is string
    <Link href={url} title="view on Spotify">
      {children}
    </Link>
  )
}

export default SpotifyButton
