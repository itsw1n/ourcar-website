import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { ContactCTA } from '@/components/shared/ContactCta'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { VehicleHeader } from '@/features/vehicles/components/VehicleHeader'
import { VehicleGallery } from '@/features/vehicles/components/VehicleGallery'
import { VehicleSpecifications } from '@/features/vehicles/components/VehicleSpecifications'
import { VehicleDescription } from '@/features/vehicles/components/VehicleDescription'
import { RelatedVehicles } from '@/features/vehicles/components/RelatedVehicles'
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
