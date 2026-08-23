import { Star } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { mockTestimonials } from '@/features/testimonials/mockData'

export function Testimonials() {
  return (
    <Section data-ui="testimonials-section" className="py-20">
      <Reveal>
        <Container>
          <SectionHeading eyebrow="Testimonials" title="What our clients say" />

          <div className="grid gap-5 md:grid-cols-3">
            {mockTestimonials.map((item) => (
              <article
                key={item.id}
                data-ui="testimonial-card"
                className="border border-border p-6"
              >
                <div
                  className="mb-5 flex gap-1 text-primary"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="leading-7 text-muted-foreground">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-6 text-sm font-bold">
                  {item.displayName}
                  {item.isMock ? (
                    <span className="ml-2 text-xs font-normal uppercase tracking-wider text-muted-foreground">
                      Mock
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Reveal>
    </Section>
  )
}
