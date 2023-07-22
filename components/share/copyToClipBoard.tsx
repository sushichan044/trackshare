'use client'

import { useState } from 'react'
import { CopyToClipboard as CopyToClipboardBase } from 'react-copy-to-clipboard'

import styles from '@/components/share/copy-to-clipboard.module.scss'

type CopyToClipboardProps = {
  textToCopy: string
  childrenBeforeCopy: React.ReactNode
  childrenAfterCopy: React.ReactNode
  title?: string
}

const CopyToClipboard = ({
  textToCopy,
  childrenAfterCopy,
  childrenBeforeCopy,
  title,
}: CopyToClipboardProps) => {
  const [isCopied, setCopied] = useState(false)

  // set isCopied to false after 2 seconds
  if (isCopied) {
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <CopyToClipboardBase text={textToCopy}>
      <button
        className={styles.root}
        onClick={() => setCopied(true)}
        title={title}
      >
        {isCopied ? <>{childrenAfterCopy}</> : <>{childrenBeforeCopy}</>}
      </button>
    </CopyToClipboardBase>
  )
}

export default CopyToClipboard
