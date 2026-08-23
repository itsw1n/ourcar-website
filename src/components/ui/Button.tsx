import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-none border font-bold uppercase tracking-wide transition-[background-color,border-color,color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  {
    variants: {
      variant: {
        primary:
          'border-primary bg-primary text-primary-foreground hover:-translate-y-px hover:border-foreground',
        dark: 'border-foreground bg-foreground text-background hover:-translate-y-px hover:border-primary hover:bg-primary',
        outline:
          'border-border bg-background text-foreground hover:-translate-y-px hover:border-foreground hover:bg-foreground hover:text-background',
        ghost:
          'border-transparent bg-transparent text-foreground hover:text-primary',
      },
      size: {
        sm: 'min-h-9 px-4 text-xs',
        md: 'min-h-11 px-5 text-sm',
        lg: 'min-h-[52px] px-7 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode
  className?: string
  href?: string
  disabled?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function Button({
  children,
  className,
  variant,
  size,
  href,
  disabled = false,
  ...rest
}: ButtonProps) {
  const resolvedVariant = variant ?? 'primary'
  const isPrimary = resolvedVariant === 'primary'
  const classes = cn(buttonVariants({ variant, size }), className)

  const content = (
    <>
      {isPrimary ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:hidden"
        />
      ) : null}
      <span className="relative z-10 flex w-full items-center gap-2">
        {children}
      </span>
    </>
  )

  if (href && !disabled) {
    return (
      <a href={href} data-ui="button" className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button
      data-ui="button"
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  )
}
