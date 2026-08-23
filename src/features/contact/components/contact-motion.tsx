'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { cn } from '@/lib/utils'
import { useIsomorphicLayoutEffect } from '@/lib/use-isomorphic-layout-effect'
import {
  siteConfig,
  getMessengerHref,
  getPhoneHref,
} from '@/config/site'

gsap.registerPlugin(ScrollTrigger)

export function ContactMotion() {
  const root = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (reduce) {
        gsap.set(
          '.contact-eyebrow, .contact-heading, .contact-desc, .contact-actions, .contact-location, .contact-media',
          { opacity: 1, x: 0, y: 0 }
        )
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.contact-eyebrow', { y: 20, opacity: 0, duration: 0.6, immediateRender: true })
        .from('.contact-heading', { y: 40, opacity: 0, duration: 0.9, immediateRender: true }, 0.1)
        .from('.contact-desc', { y: 24, opacity: 0, duration: 0.7, immediateRender: true }, 0.25)
        .from(
          '.contact-actions > *',
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, immediateRender: true },
          0.35
        )
        .from('.contact-location', { y: 24, opacity: 0, duration: 0.7, immediateRender: true }, 0.45)
        .from('.contact-media', { y: 40, opacity: 0, duration: 1, immediateRender: true }, 0.2)

      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.to('.contact-media-inner', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: '.contact-media',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const messenger = getMessengerHref()
  const phone = getPhoneHref()

  return (
    <section
      ref={root}
      data-ui="contact"
      className={cn('relative w-full border-b border-border')}
    >
      <Container
        className={cn(
          'grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'
        )}
      >
        <div>
          <div
            className={cn(
              'contact-eyebrow mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary'
            )}
          >
            Get in touch
          </div>
          <h1
            className={cn(
              'contact-heading max-w-xl text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl'
            )}
          >
            Interested
            <br />
            in a unit?
          </h1>
          <p
            className={cn(
              'contact-desc mt-7 max-w-md text-base leading-7 text-muted-foreground'
            )}
          >
            Found something you like or want to ask about available vehicles?
            Contact us directly.
          </p>

          <div className={cn('contact-actions mt-8 flex flex-wrap gap-3')}>
            {messenger ? (
              <Button href={messenger} variant="primary" size="lg">
                Message on Messenger
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                />
              </Button>
            ) : (
              <Button variant="primary" size="lg" disabled>
                <MessageCircle size={18} aria-hidden="true" />
                Messenger soon
              </Button>
            )}

            {phone ? (
              <Button href={phone} variant="outline" size="lg">
                <Phone size={18} aria-hidden="true" />
                Call / Text
              </Button>
            ) : null}
          </div>
        </div>
      </Container>

      <Container
        className={cn(
          'grid gap-10 pb-20 md:pb-28 lg:grid-cols-[0.4fr_0.6fr] lg:items-center lg:gap-16'
        )}
      >
        <div className={cn('contact-location border-t border-border pt-6')}>
          <div className={cn('text-3xl font-black uppercase leading-none tracking-tight md:text-4xl')}>
            Davao City
          </div>
          <div
            className={cn(
              'mt-1 text-3xl font-black uppercase leading-none tracking-tight text-muted-foreground md:text-4xl'
            )}
          >
            Philippines
          </div>
          <p className={cn('mt-5 max-w-xs text-sm leading-6 text-muted-foreground')}>
            {siteConfig.tagline}
          </p>
        </div>

        <div
          className={cn(
            'contact-media relative aspect-[4/3] overflow-hidden border border-border bg-muted'
          )}
        >
          <div className={cn('contact-media-inner absolute inset-0')}>
            <Image
              src="/mock-car-3.png"
              alt="Wing's Buy n Sell Japanese surplus mini van"
              fill
              className="object-contain p-8"
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
