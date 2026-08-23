import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

export function VehicleSpecifications({ vehicle }: { vehicle: Vehicle }) {
  const specs = [
    { label: 'Year', value: String(vehicle.year) },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Mileage', value: `${vehicle.mileageKm.toLocaleString()} KM` },
    { label: 'Category', value: vehicle.category },
  ]

  return (
    <Container className={cn('border-t border-border py-16')}>
      <div
        className={cn(
          'grid grid-cols-2 gap-y-10 border-y border-border md:grid-cols-4'
        )}
      >
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={cn(
              'px-2',
              i !== 0 && 'md:border-l md:border-border md:pl-8'
            )}
          >
            <div
              className={cn(
                'text-xs font-bold uppercase tracking-[0.2em] text-primary'
              )}
            >
              {spec.label}
            </div>
            <div
              className={cn(
                'mt-3 text-2xl font-black uppercase tracking-tight md:text-3xl'
              )}
            >
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
