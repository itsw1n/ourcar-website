import { SectionHeading } from '@/components/shared/SectionHeading'
import { VehicleCard } from '@/components/shared/VehicleCard'
import { Reveal } from '@/components/shared/Reveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

export function AvailableVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <Section
      data-ui="available-vehicles-section"
      className="border-b border-border py-20"
    >
      <Reveal>
        <Container>
          <SectionHeading
            eyebrow="Available Units"
            title="Find your next van"
            link={{ label: 'Browse all cars', href: '/cars?status=available' }}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </Container>
      </Reveal>
    </Section>
  )
}
