import Image from 'next/image'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

export function SoldUnits({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <Section
      data-ui="sold-vehicles-section"
      className="border-b border-border py-20"
    >
      <Reveal>
        <Container>
          <SectionHeading
            eyebrow="Sold Units"
            title="Quality units. Satisfied buyers."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                data-ui="sold-vehicle"
                className="relative aspect-square overflow-hidden bg-muted"
              >
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-contain p-4"
                />
                <StatusBadge
                  status={vehicle.status}
                  className="absolute left-3 top-3"
                />
              </div>
            ))}
          </div>
        </Container>
      </Reveal>
    </Section>
  )
}
