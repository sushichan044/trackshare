import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

import { getUserSpotifyAccessToken, SpotifyClient } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }
  const queries = request.nextUrl.searchParams
  const timeRange = queries.get('timeRange') ?? 'short_term'
  if (
    timeRange !== 'short_term' &&
    timeRange !== 'medium_term' &&
    timeRange !== 'long_term'
  ) {
    return NextResponse.json({ error: 'Invalid time range' }, { status: 400 })
  }
  const limit = parseInt(queries.get('limit') ?? '10')
  const offset = parseInt(queries.get('offset') ?? '5')

  const tokens = await getUserSpotifyAccessToken(user.id)
  if (!tokens[0]) {
    return NextResponse.json({ error: 'No token' }, { status: 401 })
  }
  const accessToken = tokens[0].token

  const client = new SpotifyClient(accessToken)
  const res = await client.getTopTracks({
    timeRange,
    limit,
    offset,
  })
  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: res.status })
  }
  return NextResponse.json(res.data)
}
