'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Container } from '@/components/layout/container'
import { cn } from '@/lib/utils'

export function AboutHeroMotion() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (reduce) {
        gsap.set('.about-eyebrow, .about-title, .about-copy, .about-visual', {
          opacity: 1,
          x: 0,
          y: 0,
        })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.about-eyebrow', { y: 20, opacity: 0, duration: 0.6 })
        .from('.about-title', { y: 40, opacity: 0, duration: 0.9 }, 0.1)
        .from('.about-copy', { y: 24, opacity: 0, duration: 0.8 }, 0.3)
        .from('.about-visual', { x: 80, opacity: 0, duration: 1.1 }, 0.1)
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      data-ui="about-hero"
      className={cn('relative border-b border-border')}
    >
      <Container className="grid min-h-[440px] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="about-eyebrow mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Our Story
          </div>
          <h1 className="about-title text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            Built from
            <br />
            experience.
          </h1>
          <p className="about-copy mt-6 max-w-md text-muted-foreground">
            Wing&apos;s Buy n Sell is built on years of hands-on work with
            Japanese surplus mini vans — from conversion and repair to
            fabrication and buy-and-sell experience.
          </p>
        </div>

        <div className="about-visual relative min-h-[320px] overflow-hidden">
          <Image
            src="/mock-car.png"
            alt="Japanese surplus mini van worked on by Wing's Buy n Sell"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Container>
    </section>
  )
}
