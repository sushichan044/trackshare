import 'ress'
import '@/styles/globals.scss'

import { ClerkProvider } from '@clerk/nextjs'
import { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'

// import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
// import Favicons from '@/components/meta/favicons'
import { fontVariables } from '@/lib/font'

export const metadata: Metadata = {
  metadataBase: new URL('https://sushichan.live'),
  title: {
    default: 'Track Share',
    template: '%s - Track Share',
  },
  description: '聴いている音楽を気軽にシェアしよう',
  openGraph: {
    url: '/',
    locale: 'ja_JP',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="ja">
        <meta content="utf-8" name="charset" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {/* <Favicons /> */}
        <body className={fontVariables}>
          <NextTopLoader color="#2b78dd" showSpinner={false} />
          <Header />
          <main>{children}</main>
          {/* <Footer /> */}
        </body>
      </html>
    </ClerkProvider>
  )
}
