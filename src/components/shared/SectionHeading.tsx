import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  link,
  className,
}: {
  eyebrow: string
  title: string
  link?: { label: string; href: string }
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end',
        className
      )}
    >
      <div>
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
          {title}
        </h2>
      </div>

      {link ? (
        <Button
          variant="ghost"
          size="sm"
          href={link.href}
          className="self-start md:self-auto"
        >
          {link.label}
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
          />
        </Button>
      ) : null}
    </div>
  )
}
