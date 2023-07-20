import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

import { getUserSpotifyAccessToken, SpotifyClient } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'No url' }, { status: 401 })
  }

  const tokens = await getUserSpotifyAccessToken(user.id)
  if (!tokens[0]) {
    return NextResponse.json({ error: 'No token' }, { status: 401 })
  }
  const accessToken = tokens[0].token

  const client = new SpotifyClient(accessToken)
  const res = await client.getTrack(url)

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status })
  }
  return NextResponse.json(res.data)
}
