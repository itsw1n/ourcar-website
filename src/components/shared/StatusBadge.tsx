import { cn } from '@/lib/utils'
import type { VehicleStatus } from '@/features/vehicles/types/vehicle'

export function StatusBadge({
  status,
  className,
}: {
  status: VehicleStatus
  className?: string
}) {
  const isSold = status === 'sold'
  return (
    <span
      data-ui="status-badge"
      className={cn(
        'inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
        isSold
          ? 'bg-foreground text-background'
          : 'bg-primary text-primary-foreground',
        className
      )}
    >
      {isSold ? 'Sold' : 'Available'}
    </span>
  )
}
