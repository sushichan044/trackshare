import { parseTweet } from 'twitter-text'

const canTweet = (text: string) => {
  const parsed = parseTweet(text)
  return parsed.valid
}

export { canTweet }
