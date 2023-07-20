// import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

import Link from '@/components/common/link'
import styles from '@/components/layout/header.module.scss'
// import LogoSvg from '@/public/logo.svg'

const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles['header-inside']}>
        <Link
          className={styles.hero}
          href="/"
          options={{ textDecoration: 'none' }}
        >
          {/* <Image alt="site logo" height={50} src={LogoSvg} width={50} /> */}
          <p className={styles.title}>track share</p>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}

export default Header
