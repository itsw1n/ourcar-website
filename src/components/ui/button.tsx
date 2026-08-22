import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'dark'
}

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      data-component="button"
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors duration-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        variant === 'primary' &&
          'bg-primary text-primary-foreground hover:opacity-90',
        variant === 'outline' &&
          'border border-border bg-background text-foreground hover:bg-muted',
        variant === 'dark' && 'bg-foreground text-background hover:opacity-90',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
