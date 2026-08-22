import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'
import { ContactCTA } from '@/components/shared/contact-cta'
import { HeroMotion } from '@/features/home/components/hero-motion'
import { AvailableVehicles } from '@/features/home/components/available-vehicles'
import { StorySection } from '@/features/home/components/story-section'
import { SoldUnits } from '@/features/home/components/sold-units'
import { Testimonials } from '@/features/home/components/testimonials'
import { getVehicles } from '@/features/vehicles/queries/vehicles'

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
