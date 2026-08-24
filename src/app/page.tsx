import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { ContactCTA } from '@/components/shared/ContactCta'
import { HeroMotion } from '@/features/home/components/HeroMotion'
import { AvailableVehicles } from '@/features/home/components/AvailableVehicles'
import { StorySection } from '@/features/home/components/StorySection'
import { SoldUnits } from '@/features/home/components/SoldUnits'
import { Testimonials } from '@/features/home/components/Testimonials'
import { getVehicles } from '@/features/vehicles/queries/vehicles'

// SSR per request — keeps the build hermetic (no DB needed at build time).
export const dynamic = 'force-dynamic'

export default async function Page() {
  const vehicles = await getVehicles()
  const available = vehicles
    .filter((vehicle) => vehicle.status === 'available')
    .slice(0, 4)
  const sold = vehicles
    .filter((vehicle) => vehicle.status === 'sold')
    .slice(0, 3)
  const heroSlides = vehicles
    .filter((vehicle) => vehicle.featured)
    .map((vehicle) => ({
      image: vehicle.image,
      caption: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    }))

  return (
    <>
      <SiteHeader />
      <main>
        <HeroMotion slides={heroSlides.length ? heroSlides : undefined} />
        <AvailableVehicles vehicles={available} />
        <StorySection />
        <SoldUnits vehicles={sold} />
        <Testimonials />
        <ContactCTA />
      </main>
      <SiteFooter />
    </>
  )
}
