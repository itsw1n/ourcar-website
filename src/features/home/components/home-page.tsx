'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Button } from '@/components/ui/button'
import { BrandLogo } from '@/components/shared/brand-logo'
import { cn } from '@/lib/utils'
import { mockVehicles } from '@/features/vehicles/queries/vehicles'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

gsap.registerPlugin(ScrollTrigger)

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article
      data-component="vehicle-card"
      className={cn(
        'group min-w-[280px] border border-border bg-background p-4 transition-transform duration-slow hover:-translate-y-1 hover:shadow-soft'
      )}
    >
      <div
        className={cn('relative mb-5 aspect-[4/3] overflow-hidden bg-muted')}
      >
        <Image
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className={cn(
            'object-contain p-2 transition-transform duration-slow group-hover:scale-[1.04]'
          )}
        />
        <span
          className={cn(
            'absolute left-3 top-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
            vehicle.status === 'sold'
              ? 'bg-foreground text-background'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {vehicle.status}
        </span>
      </div>

      <h3 className={cn('text-lg font-black uppercase tracking-tight')}>
        {vehicle.brand} {vehicle.model}
      </h3>
      <p className={cn('mt-2 text-sm text-muted-foreground')}>
        {vehicle.year} · {vehicle.transmission}
      </p>
      <p className={cn('mt-1 text-sm text-muted-foreground')}>
        {vehicle.mileageKm.toLocaleString()} km
      </p>

      <div
        className={cn(
          'mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-bold uppercase tracking-wider'
        )}
      >
        View details
        <ArrowRight size={16} aria-hidden="true" />
      </div>
    </article>
  )
}

export function HomePage() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker', { y: 20, opacity: 0, duration: 0.7 })
      gsap.from('.hero-title', { y: 50, opacity: 0, duration: 0.9, delay: 0.1 })
      gsap.from('.hero-copy', { y: 30, opacity: 0, duration: 0.8, delay: 0.25 })
      gsap.from('.hero-actions', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.35,
      })
      gsap.from('.hero-car', {
        x: 120,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      })

      gsap.to('.hero-car', {
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

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
        })
      })
    }, root)

    return () => {
      cancelAnimationFrame(rafId)
      ctx.revert()
      lenis.destroy()
    }
  }, [])

  const phoneHref = process.env.NEXT_PUBLIC_BUSINESS_PHONE
    ? `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`
    : '#'

  return (
    <div ref={root}>
      <header
        data-component="site-header"
        className={cn(
          'sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur'
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between px-6 py-4'
          )}
        >
          <BrandLogo />

          <nav
            className={cn(
              'hidden items-center gap-8 text-xs font-bold uppercase tracking-wider md:flex'
            )}
          >
            <a href="#home">Home</a>
            <a href="#cars">Browse Cars</a>
            <a href="#story">About</a>
            <a href="#testimonials">Testimonials</a>
          </nav>

          <div className={cn('flex items-center gap-2')}>
            <a
              href={phoneHref}
              className={cn(
                'hidden min-h-11 items-center gap-2 border border-border px-4 py-3 text-xs font-bold md:flex'
              )}
            >
              <Phone size={16} aria-hidden="true" />
              Call / Text
            </a>

            <Button variant="dark">
              <MessageCircle size={16} aria-hidden="true" />
              Message Us
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="home"
          data-component="hero-section"
          className={cn(
            'hero relative overflow-hidden border-b border-border bg-background'
          )}
        >
          <div
            className={cn(
              'mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr]'
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
                Quality Japanese surplus mini vans, converted and built with
                years of hands-on experience you can trust.
              </p>

              <div className={cn('hero-actions mt-8 flex flex-wrap gap-3')}>
                <Button>
                  <MessageCircle size={18} aria-hidden="true" />
                  Message on Messenger
                </Button>

                <a
                  href={phoneHref}
                  className={cn(
                    'inline-flex min-h-11 items-center justify-center gap-3 border border-border px-6 py-4 text-sm font-bold uppercase tracking-wide transition-colors duration-default hover:bg-muted'
                  )}
                >
                  <Phone size={18} aria-hidden="true" />
                  Call / Text
                </a>
              </div>
            </div>

            <div className={cn('hero-car relative min-h-[420px]')}>
              <div
                className={cn(
                  'absolute inset-x-10 bottom-8 h-16 rounded-[50%] bg-foreground/10 blur-2xl'
                )}
              />
              <Image
                src="/mock-car.png"
                alt="Japanese surplus mini van"
                fill
                priority
                className={cn('object-contain')}
              />
            </div>
          </div>
        </section>

        <section
          id="cars"
          data-component="featured-vehicles-section"
          className={cn('reveal border-b border-border py-20')}
        >
          <div className={cn('mx-auto max-w-7xl px-6')}>
            <div
              className={cn(
                'mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end'
              )}
            >
              <div>
                <div
                  className={cn(
                    'mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary'
                  )}
                >
                  Available Units
                </div>
                <h2
                  className={cn(
                    'text-4xl font-black uppercase tracking-tight md:text-5xl'
                  )}
                >
                  Find your next van
                </h2>
              </div>

              <a
                href="/cars"
                className={cn(
                  'flex items-center gap-2 text-sm font-bold uppercase tracking-wider'
                )}
              >
                Browse all cars
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>

            <div className={cn('flex snap-x gap-5 overflow-x-auto pb-4')}>
              {mockVehicles.map((vehicle) => (
                <div key={vehicle.id} className={cn('snap-start')}>
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="story"
          data-component="story-section"
          className={cn('reveal border-b border-border py-24')}
        >
          <div
            className={cn('mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2')}
          >
            <div className={cn('min-h-[420px] bg-muted p-10')}>
              <div className={cn('flex h-full items-end')}>
                <div className={cn('max-w-sm')}>
                  <div
                    className={cn(
                      'text-xs font-bold uppercase tracking-[0.2em] text-primary'
                    )}
                  >
                    Our Story
                  </div>
                  <h2
                    className={cn(
                      'mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tight'
                    )}
                  >
                    Experience.
                    <br />
                    Hard work.
                    <br />
                    Trust.
                  </h2>
                </div>
              </div>
            </div>

            <div className={cn('flex flex-col justify-center')}>
              <div className={cn('space-y-8 border-l border-primary pl-7')}>
                {[
                  [
                    'Age 20',
                    'Started as a helper and learned Japanese surplus mini van conversion and body work from the ground up.',
                  ],
                  [
                    'Age 28',
                    'Became an independent contractor and continued conversion, repair, fabrication and tack welding work.',
                  ],
                  [
                    '3+ Years',
                    'Built experience buying and selling Japanese surplus vehicles.',
                  ],
                  [
                    'Today',
                    'At age 44, continues decades of hands-on vehicle work in Davao City.',
                  ],
                ].map(([title, text]) => (
                  <div key={title} className={cn('relative')}>
                    <span
                      className={cn(
                        'absolute -left-[34px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background'
                      )}
                    />
                    <div
                      className={cn(
                        'text-sm font-black uppercase tracking-wider'
                      )}
                    >
                      {title}
                    </div>
                    <p className={cn('mt-2 max-w-lg text-muted-foreground')}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          data-component="sold-vehicles-section"
          className={cn('reveal border-b border-border py-20')}
        >
          <div className={cn('mx-auto max-w-7xl px-6')}>
            <div className={cn('mb-10')}>
              <div
                className={cn(
                  'text-xs font-bold uppercase tracking-[0.2em] text-primary'
                )}
              >
                Sold Units
              </div>
              <h2
                className={cn(
                  'mt-3 text-4xl font-black uppercase tracking-tight'
                )}
              >
                Quality units. Satisfied buyers.
              </h2>
            </div>

            <div className={cn('grid gap-5 md:grid-cols-3')}>
              {mockVehicles
                .filter((vehicle) => vehicle.status === 'sold')
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={cn(
                      'relative aspect-square overflow-hidden bg-muted'
                    )}
                  >
                    <Image
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className={cn('object-contain p-4')}
                    />
                    <span
                      className={cn(
                        'absolute left-3 top-3 bg-foreground px-2 py-1 text-[10px] font-bold uppercase text-background'
                      )}
                    >
                      Sold
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          data-component="testimonials-section"
          className={cn('reveal py-20')}
        >
          <div className={cn('mx-auto max-w-7xl px-6')}>
            <div className={cn('mb-10')}>
              <div
                className={cn(
                  'text-xs font-bold uppercase tracking-[0.2em] text-primary'
                )}
              >
                Testimonials
              </div>
              <h2
                className={cn(
                  'mt-3 text-4xl font-black uppercase tracking-tight'
                )}
              >
                What our clients say
              </h2>
            </div>

            <div className={cn('grid gap-5 md:grid-cols-3')}>
              {[
                'Maayos kaayo ang unit. Salamat sir sa paspas ug honest na transaction!',
                'Highly recommended. Quality unit and very approachable seller.',
                'From conversion to delivery, solid kaayo. Smooth transaction.',
              ].map((quote, index) => (
                <article
                  key={quote}
                  data-component="testimonial-card"
                  className={cn('border border-border p-6')}
                >
                  <div className={cn('mb-5 flex gap-1 text-primary')}>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <CheckCircle2
                        key={starIndex}
                        size={16}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className={cn('leading-7 text-muted-foreground')}>
                    “{quote}”
                  </p>
                  <div className={cn('mt-6 text-sm font-bold')}>
                    Mock Customer {index + 1}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer
        data-component="site-footer"
        className={cn('border-t border-border')}
      >
        <div
          className={cn(
            'mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3'
          )}
        >
          <BrandLogo />
          <p className={cn('max-w-sm text-sm leading-6 text-muted-foreground')}>
            Japanese surplus mini vans converted and built with experience you
            can trust.
          </p>
          <div className={cn('md:text-right')}>
            <div className={cn('font-bold')}>Davao City, Philippines</div>
            <div className={cn('mt-2 text-sm text-muted-foreground')}>
              Messenger link will be configured later.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
