'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

export function CraftsmanshipImageMotion() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.craft-image',
        { scale: 1 },
        {
          scale: 1.03,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      data-ui="craftsmanship-image"
      className="relative aspect-[4/3] overflow-hidden bg-muted"
    >
      <Image
        src="/mock-car.png"
        alt="Japanese surplus mini van — placeholder for workshop imagery"
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="craft-image object-contain p-4"
      />
    </div>
  )
}
