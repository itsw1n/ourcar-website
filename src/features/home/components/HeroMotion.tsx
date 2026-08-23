'use client'

import { useEffect, useRef } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { HeroCarousel } from '@/features/home/components/HeroCarousel'
import { cn } from '@/lib/utils'
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect'
import { getMessengerHref, getPhoneHref } from '@/config/site'

gsap.registerPlugin(ScrollTrigger)

const FOCUS = '.hero-kicker, .hero-title, .hero-copy, .hero-actions, .hero-car'

type HeroSlide = { image: string; caption?: string }

export function HeroMotion({
  slides = [{ image: '/mock-car.png' }],
}: {
  slides?: HeroSlide[]
}) {
  const root = useRef<HTMLElement>(null)

  useIsomorphicLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (reduce) {
        gsap.set(FOCUS, { opacity: 1, x: 0, y: 0, scale: 1 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-kicker', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        immediateRender: true,
      })
        .from(
          '.hero-title',
          { y: 50, opacity: 0, duration: 0.9, immediateRender: true },
          0.1
        )
        .from(
          '.hero-copy',
          { y: 30, opacity: 0, duration: 0.8, immediateRender: true },
          0.25
        )
        .from(
          '.hero-actions',
          { y: 20, opacity: 0, duration: 0.8, immediateRender: true },
          0.35
        )
        .from(
          '.hero-car',
          {
            x: 120,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            immediateRender: true,
          },
          0.05
        )

      gsap.to('.hero-car-stage', {
        yPercent: 8,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const messenger = getMessengerHref()
  const phone = getPhoneHref()

  return (
    <section
      id="home"
      ref={root}
      data-ui="hero-section"
      className={cn(
        'hero relative overflow-hidden border-b border-border bg-background'
      )}
    >
      <Container
        className={cn(
          'grid min-h-[560px] items-center gap-10 py-12 lg:grid-cols-[0.8fr_1.2fr]'
        )}
      >
        <div className={cn('relative z-10')}>
          <div
            className={cn(
              'hero-kicker mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary'
            )}
          >
            Japanese Surplus Mini Vans
            <span className={cn('h-px w-10 bg-primary')} />
          </div>

          <h1
            className={cn(
              'hero-title max-w-xl text-6xl font-black uppercase leading-[0.9] tracking-[-0.05em] md:text-7xl'
            )}
          >
            Built right.
            <br />
            Driven far.
          </h1>

          <p
            className={cn(
              'hero-copy mt-7 max-w-md text-base leading-7 text-muted-foreground'
            )}
          >
            Quality Japanese surplus mini vans, converted and built with years
            of hands-on experience you can trust.
          </p>

          <div className={cn('hero-actions mt-8 flex flex-wrap gap-3')}>
            {messenger ? (
              <Button href={messenger} variant="primary" size="lg">
                <MessageCircle size={18} aria-hidden="true" />
                Message on Messenger
              </Button>
            ) : (
              <Button variant="primary" size="lg" disabled>
                <MessageCircle size={18} aria-hidden="true" />
                Message on Messenger
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

        <div className={cn('hero-car relative min-h-[500px] overflow-hidden')}>
          <div
            className={cn(
              'absolute inset-x-10 bottom-8 h-16 rounded-[50%] bg-foreground/10 blur-2xl'
            )}
          />
          <HeroCarousel slides={slides} />
        </div>
      </Container>
    </section>
  )
}
