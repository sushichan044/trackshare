import { FaTwitter } from 'react-icons/fa6'

import Link from '@/components/common/link'

const TweetButton = ({ tweet }: { tweet: string }) => {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweet
  )}`

  return (
    // @ts-expect-error href is string
    <Link href={tweetUrl} target="_blank">
      <FaTwitter />
    </Link>
  )
}

export default TweetButton
