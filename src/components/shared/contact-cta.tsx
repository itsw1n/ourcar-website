import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { cn } from '@/lib/utils'
import { getMessengerHref } from '@/config/site'

export function ContactCTA() {
  const messenger = getMessengerHref()

  return (
    <Section
      data-ui="contact-cta"
      className={cn('border-t border-foreground bg-foreground text-background')}
    >
      <Container className={cn('flex flex-col items-start gap-8 py-24')}>
        <div
          className={cn(
            'text-xs font-bold uppercase tracking-[0.2em] text-primary'
          )}
        >
          Interested in a unit?
        </div>
        <h2
          className={cn(
            'max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl'
          )}
        >
          Message us and let&apos;s talk.
        </h2>

        {messenger ? (
          <Button href={messenger} variant="primary" size="lg">
            <MessageCircle size={18} aria-hidden="true" />
            Message on Messenger
          </Button>
        ) : (
          <Button variant="primary" size="lg" disabled>
            <MessageCircle size={18} aria-hidden="true" />
            Messenger soon
          </Button>
        )}
      </Container>
    </Section>
  )
}
