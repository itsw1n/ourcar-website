import { cn } from '@/lib/utils'
import type { VehicleStatus } from '@/features/vehicles/types/vehicle'

export function StatusBadge({ status }: { status: VehicleStatus }) {
  const available = status === 'available'
  return (
    <span
      data-ui="status-badge"
      className={cn(
        'inline-flex border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        available
          ? 'border-primary text-primary'
          : 'border-border text-muted-foreground'
      )}
    >
      {available ? 'Available' : 'Sold'}
    </span>
  )
}
