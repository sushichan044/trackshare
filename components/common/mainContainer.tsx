import clsx from 'clsx'

import styles from '@/components/common/main-container.module.scss'

export default function MainContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={clsx(styles.root, className && className)}>{children}</div>
  )
}
