import { SectionHeading } from '@/components/shared/section-heading'
import { VehicleCard } from '@/components/shared/vehicle-card'
import { Reveal } from '@/components/shared/reveal'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
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

          <div className="flex snap-x gap-5 overflow-x-auto pb-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="snap-start">
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </Container>
      </Reveal>
    </Section>
  )
}
