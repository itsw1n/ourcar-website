import { Container } from '@/components/layout/container'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

export function VehicleDescription({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Container className={cn('border-b border-border py-16')}>
      <div
        className={cn(
          'mb-6 text-xs font-bold uppercase tracking-[0.2em] text-primary'
        )}
      >
        About this unit
      </div>
      <h2
        className={cn(
          'max-w-3xl text-3xl font-black uppercase leading-[1.05] tracking-tight md:text-4xl'
        )}
      >
        {vehicle.brand} {vehicle.model} {vehicle.year}
      </h2>
      <p
        className={cn(
          'mt-6 max-w-2xl text-base leading-7 text-muted-foreground'
        )}
      >
        {vehicle.description ??
          'Details for this unit will be available soon. Message us to learn more.'}
      </p>
    </Container>
  )
}
