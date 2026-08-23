import { Suspense } from 'react'
import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'
import { ContactCTA } from '@/components/shared/contact-cta'
import { Reveal } from '@/components/shared/reveal'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { QueryProvider } from '@/providers/query-provider'
import { BrowseCars } from '@/features/vehicles/components/browse-cars'
import { VehicleGridSkeleton } from '@/features/vehicles/components/vehicle-grid'
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
