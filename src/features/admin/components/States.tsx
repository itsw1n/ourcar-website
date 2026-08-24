import { cn } from '@/lib/utils'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      data-ui="loading-state"
      className="p-10 text-center text-sm text-muted-foreground"
    >
      {label}
    </div>
  )
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div
      data-ui="error-state"
      role="alert"
      className="border border-primary bg-primary/10 p-6 text-sm font-medium text-primary"
    >
      {error}
    </div>
  )
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div
      data-ui="empty-state"
      className="border border-dashed border-border p-10 text-center"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-foreground">
        {title}
      </p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}

export function StatCard({
  label,
  value,
  className,
}: {
  label: string
  value: number | string
  className?: string
}) {
  return (
    <div
      data-ui="stat-card"
      className={cn('border border-border bg-background p-5', className)}
    >
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
