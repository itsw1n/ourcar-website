import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'
import { ContactCTA } from '@/components/shared/contact-cta'
import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { VehicleHeader } from '@/features/vehicles/components/vehicle-header'
import { VehicleGallery } from '@/features/vehicles/components/vehicle-gallery'
import { VehicleSpecifications } from '@/features/vehicles/components/vehicle-specifications'
import { VehicleDescription } from '@/features/vehicles/components/vehicle-description'
import { RelatedVehicles } from '@/features/vehicles/components/related-vehicles'
import { getVehicles } from '@/features/vehicles/queries/vehicles'
import { vehicleImages } from '@/features/vehicles/types/vehicle'

type PageProps = { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateStaticParams() {
  const vehicles = await getVehicles()
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const vehicles = await getVehicles()
  const vehicle = vehicles.find((item) => item.slug === slug)
  if (!vehicle) return { title: "Vehicle not found — Wing's Buy n Sell" }
  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.year} — Wing's Buy n Sell`,
    description: `${vehicle.brand} ${vehicle.model} ${vehicle.year}, ${vehicle.transmission}, ${vehicle.mileageKm.toLocaleString()} km. ${vehicle.category} in Davao City.`,
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const vehicles = await getVehicles()
  const vehicle = vehicles.find((item) => item.slug === slug)
  if (!vehicle) notFound()

  const images = vehicleImages(vehicle)
  const related = vehicles
    .filter((item) => item.slug !== vehicle.slug)
    .slice(0, 3)
  const alt = `${vehicle.brand} ${vehicle.model}`

  return (
    <>
      <SiteHeader />
      <main>
        <VehicleHeader vehicle={vehicle} />

        <section
          data-ui="vehicle-gallery-section"
          className="border-b border-border"
        >
          <Container className="py-2">
            <VehicleGallery images={images} alt={alt} />
          </Container>
        </section>

        <VehicleSpecifications vehicle={vehicle} />
        <VehicleDescription vehicle={vehicle} />
        <RelatedVehicles vehicles={related} />

        <ContactCTA />
      </main>
      <SiteFooter />
    </>
  )
}
