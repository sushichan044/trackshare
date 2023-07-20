import clsx from 'clsx'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import React from 'react'

import styles from '@/components/common/link.module.scss'

type LinkProps<T> = NextLinkProps<T> & {
  children: React.ReactNode
  options?: {
    color?: 'inherit' | 'blue'
    textDecoration?: 'inherit' | 'none' | 'underline'
  }
}

const Link = <T,>({
  options: { textDecoration, color } = {
    textDecoration: 'underline',
    color: 'inherit',
  },
  className,
  ...props
}: LinkProps<T>) => {
  return (
    <NextLink
      className={clsx(className, {
        [styles['deco-underline']]: textDecoration === 'underline',
        [styles['deco-inherit']]: textDecoration === 'inherit',
        [styles['deco-none']]: textDecoration === 'none',
        [styles['color-inherit']]: color === 'inherit',
        [styles['color-blue']]: color === 'blue',
      })}
      {...props}
    >
      {props.children}
    </NextLink>
  )
}

export default Link
