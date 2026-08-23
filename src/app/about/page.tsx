import type { Metadata } from 'next'
import { ArrowRight, CarFront, Wrench, Hammer, Cog, Flame } from 'lucide-react'
import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { ContactCTA } from '@/components/shared/ContactCta'
import { Reveal } from '@/components/shared/Reveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/Button'
import { StoryTimeline } from '@/features/home/components/StoryTimeline'
import { AboutHeroMotion } from '@/features/about/components/AboutHero'
import { CraftsmanshipImageMotion } from '@/features/about/components/CraftsmanshipImage'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: "About — Wing's Buy n Sell",
  description:
    'The story behind Wing’s Buy n Sell — hands-on Japanese surplus mini van conversion, repair, fabrication and buy-and-sell experience in Davao City.',
}

const workCategories = [
  { label: 'Conversion', Icon: CarFront },
  { label: 'Repair', Icon: Wrench },
  { label: 'Body Work', Icon: Hammer },
  { label: 'Fabrication', Icon: Cog },
  { label: 'Tack Welding', Icon: Flame },
] as const

const values = [
  {
    n: '01',
    title: 'Hands-on experience',
    text: 'Learned through years of actual vehicle work.',
  },
  {
    n: '02',
    title: 'Workmanship',
    text: 'Conversion and fabrication experience from the ground up.',
  },
  {
    n: '03',
    title: 'Straightforward dealing',
    text: 'Interested buyers can directly message or call.',
  },
  {
    n: '04',
    title: 'Proven units',
    text: 'Available and sold units remain visible on the website.',
  },
] as const

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Section
          data-ui="experience-statement"
          className="border-b border-border py-24"
        >
          <Container>
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Experience
                </div>
                <h2 className="text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-5xl">
                  24 years since he first started learning and working in the
                  trade.
                </h2>
                <p className="mt-6 text-muted-foreground">
                  Started at age 20. Still working hands-on today at age 44.
                </p>
              </div>
            </Reveal>
          </Container>
        </Section>

        <Section
          data-ui="about-timeline"
          className="border-b border-border py-24"
        >
          <Container>
            <SectionHeading
              eyebrow="Our Journey"
              title="From helper to hands-on today"
            />
            <div className="mx-auto mt-12 max-w-2xl">
              <StoryTimeline />
            </div>
          </Container>
        </Section>

        <Section
          data-ui="craftsmanship"
          className="border-b border-border py-24"
        >
          <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <CraftsmanshipImageMotion />
            <div>
              <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
                Hands-on
                <br />
                from the start.
              </h2>
              <p className="mt-6 max-w-md text-muted-foreground">
                Japanese surplus mini van work has included conversion, repair,
                body work, fabrication and tack welding — learned from the
                ground up.
              </p>
              <ul className="mt-8 border-y border-border">
                {workCategories.map(({ label, Icon }) => (
                  <li
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0"
                  >
                    <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
                      <Icon
                        size={18}
                        aria-hidden="true"
                        className="text-primary"
                      />
                      {label}
                    </span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="text-muted-foreground"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        <Section
          data-ui="about-values"
          className="border-b border-border py-24"
        >
          <Container>
            <SectionHeading
              eyebrow="Our Promise"
              title="What Wing's stands for"
            />
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ n, title, text }) => (
                <div key={n} className="border-t border-border pt-6">
                  <div className="text-3xl font-black text-primary">{n}</div>
                  <h3 className="mt-4 text-lg font-black uppercase tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <ContactCTA />
      </main>
      <SiteFooter />
    </>
  )
}
