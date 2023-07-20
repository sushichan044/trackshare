'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React from 'react'

import styles from '@/components/refresh.module.scss'

export const RefreshButton = ({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) => {
  const router = useRouter()
  const onClick = () => {
    router.refresh()
  }

  return (
    <button
      className={clsx(styles.root, className && className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default RefreshButton
