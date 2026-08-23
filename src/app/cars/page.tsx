import { Suspense } from 'react'
import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { ContactCTA } from '@/components/shared/ContactCta'
import { Reveal } from '@/components/shared/Reveal'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { QueryProvider } from '@/components/shared/QueryProvider'
import { BrowseCars } from '@/features/vehicles/components/BrowseCars'
import { VehicleGridSkeleton } from '@/features/vehicles/components/VehicleGrid'
import { getVehicles } from '@/features/vehicles/queries/vehicles'

export default async function CarsPage() {
  const initialData = await getVehicles()

  return (
    <>
      <SiteHeader />
      <main>
        <Section
          data-ui="browse-cars-page"
          className="border-b border-border py-20"
        >
          <Reveal>
            <Container>
              <div className="mb-10">
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Our Vehicles
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
                  Browse Cars
                </h1>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  Browse available and sold Japanese surplus mini vans.
                </p>
              </div>

              <QueryProvider>
                <Suspense fallback={<VehicleGridSkeleton count={6} />}>
                  <BrowseCars initialData={initialData} />
                </Suspense>
              </QueryProvider>
            </Container>
          </Reveal>
        </Section>

        <ContactCTA />
      </main>
      <SiteFooter />
    </>
  )
}
