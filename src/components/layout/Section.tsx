import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Section({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      data-ui="section"
      className={cn('relative w-full', className)}
      {...rest}
    >
      {children}
    </section>
  )
}
