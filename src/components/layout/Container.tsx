import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Container({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-ui="container"
      className={cn('mx-auto w-full max-w-7xl px-6 md:px-8', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
