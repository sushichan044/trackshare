import queryString from 'query-string'

import Link from '@/components/common/link'

type TweetProps = {
  text: string
  url: string
  hashtags: string[]
  via: string
}

type TweetButtonProps = Partial<TweetProps> & {
  children: React.ReactNode
}

const Tweet = ({ via, children, ...rest }: TweetButtonProps) => {
  if (via?.startsWith('@')) {
    via = via.slice(1)
  }
  const query = { via, ...rest }

  const url = queryString.stringifyUrl(
    {
      url: 'https://twitter.com/intent/tweet',
      query,
    },
    {
      arrayFormat: 'comma',
    }
  )

  return (
    // @ts-expect-error href is string
    <Link href={url} target="_blank">
      {children}
    </Link>
  )
}

export default Tweet
