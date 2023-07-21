'use client'

import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FaCheck, FaCopy } from 'react-icons/fa6'

import styles from '@/components/share/clipboard-button.module.scss'

const CopyToClipboardButton = ({ text }: { text: string }) => {
  const [isCopied, setCopied] = useState(false)

  // set to false after 3 seconds
  if (isCopied) {
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <CopyToClipboard text={text}>
      <button
        className={styles.root}
        onClick={() => setCopied(true)}
        title="Copy #Nowplaying to Clipboard"
      >
        {isCopied ? <FaCheck /> : <FaCopy />}
      </button>
    </CopyToClipboard>
  )
}

export default CopyToClipboardButton
