import { Wrench } from 'lucide-react'
import { StoryTimeline } from './story-timeline'
import { Reveal } from '@/components/shared/reveal'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { cn } from '@/lib/utils'

export function StorySection() {
  return (
    <Section data-ui="story-section" className="border-b border-border py-24">
      <Container className="grid gap-16 lg:grid-cols-2">
        <Reveal className="flex min-h-[420px] flex-col justify-end bg-muted p-10">
          <div className="max-w-sm">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Wrench size={16} aria-hidden="true" />
              Our Story
            </div>
            <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tight">
              Experience.
              <br />
              Hard work.
              <br />
              Trust.
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <StoryTimeline />
        </div>
      </Container>
    </Section>
  )
}
