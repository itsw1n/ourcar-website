'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

type Slide = { image: string; caption?: string }

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const prevIndex = useRef(0)
  const reduceRef = useRef(false)
  const startX = useRef<number | null>(null)
  const goTo = (i: number) => setIndex(i)

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (dx < -50) goTo((index + 1) % slides.length)
    else if (dx > 50) goTo((index - 1 + slides.length) % slides.length)
  }
  const onPointerLeave = () => {
    startX.current = null
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goTo((index - 1 + slides.length) % slides.length)
    else if (e.key === 'ArrowRight') goTo((index + 1) % slides.length)
  }

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      slideRefs.current.forEach((el, i) => {
        if (!el) return
        if (i === 0) gsap.set(el, { xPercent: 0, opacity: 1 })
        else gsap.set(el, { xPercent: 110, opacity: 0 })
      })
    }, stageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (reduceRef.current) {
      slideRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { xPercent: 0, opacity: i === index ? 1 : 0 })
      })
      return
    }

    const prev = prevIndex.current
    if (prev === index) return

    const old = slideRefs.current[prev]
    const cur = slideRefs.current[index]
    if (old && old !== cur) {
      gsap.to(old, {
        xPercent: -110,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      })
    }
    if (cur) {
      gsap.fromTo(
        cur,
        { xPercent: 110, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.inOut' }
      )
    }
    prevIndex.current = index
  }, [index])

  useEffect(() => {
    if (reduceRef.current || paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 3000)
    return () => clearInterval(id)
  }, [paused, slides.length])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <div
      data-ui="hero-carousel"
      className={cn('relative min-h-[500px] w-full select-none')}
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
    >
      <div
        ref={stageRef}
        data-ui="hero-car-stage"
        className={cn('hero-car-stage absolute inset-0')}
      >
        {slides.map((slide, i) => (
          <div
            key={`${slide.image}-${i}`}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className={cn(
              'absolute inset-0',
              i === 0 ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt={slide.caption ?? 'Featured vehicle'}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={cn('object-contain')}
            />
          </div>
        ))}
      </div>

      {slides[index]?.caption ? (
        <div
          className={cn(
            'absolute left-3 top-3 rounded-none bg-background/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur'
          )}
        >
          {slides[index].caption}
        </div>
      ) : null}

      {slides.length > 1 ? (
        <div
          data-ui="hero-dots"
          className={cn(
            'absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2'
          )}
          role="tablist"
          aria-label="Choose slide"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors duration-200',
                i === index
                  ? 'bg-primary'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
