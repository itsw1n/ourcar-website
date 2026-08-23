import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { VehicleCard } from '@/components/shared/vehicle-card'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

export function RelatedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null

  return (
    <Container className={cn('border-t border-border py-16')}>
      <SectionHeading eyebrow="More to see" title="Other vehicles" />
      <div
        className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3')}
      >
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} className="w-full" />
        ))}
      </div>
    </Container>
  )
}
