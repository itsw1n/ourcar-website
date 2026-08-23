'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import type Lenis from 'lenis'

type GsapLike = {
  registerPlugin: (plugin: unknown) => void
  ticker: {
    add: (cb: (time: number) => void) => void
    remove: (cb: (time: number) => void) => void
    lagSmoothing: (value: number) => void
  }
}

type ScrollTriggerLike = {
  update: () => void
  refresh: () => void
}

export function SmoothScrollProvider() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let cleanup = () => {}

    void (async () => {
      const [{ default: Lenis }, gsapModule, scrollTriggerModule] =
        await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])
      if (cancelled) return

      const gsap = (
        (gsapModule as { default?: GsapLike }).default ?? gsapModule
      ) as GsapLike
      const ScrollTrigger = (
        scrollTriggerModule as { ScrollTrigger: ScrollTriggerLike }
      ).ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
      lenisRef.current = lenis
      lenis.on('scroll', ScrollTrigger.update)

      const update = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(update)
      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        gsap.ticker.remove(update)
        lenis.destroy()
        lenisRef.current = null
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (pathname === undefined) return
    const id = requestAnimationFrame(() => {
      void import('gsap/ScrollTrigger').then((scrollTriggerModule) => {
        const ScrollTrigger = (
          scrollTriggerModule as { ScrollTrigger: ScrollTriggerLike }
        ).ScrollTrigger
        lenisRef.current?.scrollTo(0, { immediate: true })
        ScrollTrigger.refresh()
      })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return null
}
