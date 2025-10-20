'use client'

import { useState } from 'react'

type CopyButtonProps = {
  text: string
  className?: string
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // navigator.clipboard API 지원 확인
      if (!navigator.clipboard) {
        // 폴백: 구식 방법 사용
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          textArea.remove()
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          textArea.remove()
          alert('복사에 실패했습니다')
        }
        return
      }
      
      // 최신 API 사용
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('복사에 실패했습니다: ' + (err as Error).message)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`px-3 py-1 text-sm rounded-lg font-medium transition-all shrink-0 ${
        copied 
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : 'bg-violet-500 text-white hover:bg-violet-600'
      } ${className}`}
    >
      {copied ? '✓ 복사됨!' : '📋 복사'}
    </button>
  )
}

