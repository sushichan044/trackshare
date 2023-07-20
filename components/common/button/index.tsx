import clsx from 'clsx'

import styles from '@/components/common/button/button.module.scss'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  onClick?: React.ComponentProps<'button'>['onClick'] | undefined
}

const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button
      className={clsx(styles.root, className && className)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
