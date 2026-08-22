'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandLogo({ className }: { className?: string }) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        data-component="brand-logo"
        className={cn('flex items-center gap-3', className)}
      >
        <div
          className={cn('relative flex h-12 w-14 items-center justify-center')}
        >
          <span
            className={cn(
              'text-[42px] font-black leading-none tracking-[-10px]'
            )}
          >
            W
          </span>
          <span className={cn('absolute top-1 h-2 w-2 rotate-45 bg-primary')} />
        </div>
        <div className={cn('leading-none')}>
          <div className={cn('text-xl font-black tracking-tight')}>
            WING&apos;S
          </div>
          <div
            className={cn(
              'mt-1 text-[10px] font-bold tracking-[0.22em] text-primary'
            )}
          >
            BUY N SELL
          </div>
        </div>
      </div>
    )
  }

  return (
    <Image
      src="/logo.png"
      alt="Wing's Buy n Sell"
      width={140}
      height={48}
      priority
      data-component="brand-logo"
      className={cn('h-12 w-auto', className)}
      onError={() => setErrored(true)}
    />
  )
}
