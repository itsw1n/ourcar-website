'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { useIsomorphicLayoutEffect } from '@/lib/use-isomorphic-layout-effect'

gsap.registerPlugin(ScrollTrigger)

type VehicleGalleryProps = {
  images: string[]
  alt: string
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const total = images.length
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduceRef = useRef(false)
  const dragging = useRef(false)
  const startX = useRef(0)

  const layout = useCallback((index: number, animate: boolean) => {
    const root = rootRef.current
    if (!root) return
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length === 0) return
    const cardW = cards[0].offsetWidth
    const spacing = cardW * 0.62
    const reduce = reduceRef.current

    cards.forEach((card, i) => {
      const offset = i - index
      let x = 0
      let rot = 0
      let scale = 1
      let opacity = 1
      let z = 30

      if (offset === 0) {
        x = 0
        rot = 0
        scale = 1
        opacity = 1
        z = 30
      } else if (offset === -1) {
        x = -spacing
        rot = reduce ? 0 : -3
        scale = reduce ? 1 : 0.92
        opacity = reduce ? 0 : 0.55
        z = 20
      } else if (offset === 1) {
        x = spacing
        rot = reduce ? 0 : 3
        scale = reduce ? 1 : 0.92
        opacity = reduce ? 0 : 0.55
        z = 20
      } else if (offset < -1) {
        x = -spacing * 1.6
        rot = reduce ? 0 : -4
        scale = reduce ? 1 : 0.86
        opacity = 0
        z = 10
      } else {
        x = spacing * 1.6
        rot = reduce ? 0 : 4
        scale = reduce ? 1 : 0.86
        opacity = 0
        z = 10
      }

      gsap.set(card, { zIndex: z })
      const props = {
        x,
        y: 0,
        rotation: rot,
        scale,
        opacity,
        xPercent: -50,
        yPercent: -50,
      }
      if (animate && !reduce) {
        gsap.to(card, { ...props, duration: 0.6, ease: 'power3.out' })
      } else {
        gsap.set(card, props)
      }
    })
  }, [])

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(total - 1, index))
      setActive(clamped)
      layout(clamped, true)
    },
    [total, layout]
  )

  useIsomorphicLayoutEffect(() => {
    reduceRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      if (cards.length === 0) return

      if (reduceRef.current) {
        layout(0, false)
        return
      }

      gsap.set(cards, { opacity: 0, scale: 0.82, xPercent: -50, yPercent: -50 })
      gsap.set('.gallery-controls', { opacity: 0 })

      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            cards[0],
            { y: 24 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: 'power3.out',
              onComplete: () => {
                layout(0, true)
                gsap.to('.gallery-controls', {
                  opacity: 1,
                  duration: 0.6,
                  ease: 'power3.out',
                })
              },
            }
          )
        },
      })

    }, root)

    return () => ctx.revert()
  }, [layout])

  useEffect(() => {
    const onResize = () => layout(active, false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active, layout])

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    startX.current = e.clientX
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - startX.current
    if (dx < -40) goTo(active + 1)
    else if (dx > 40) goTo(active - 1)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    }
  }

  const isFirst = active === 0
  const isLast = active === total - 1

  return (
    <div
      ref={rootRef}
      data-ui="vehicle-gallery"
      className={cn('relative w-full select-none')}
      role="group"
      aria-roledescription="image gallery"
      aria-label={`${alt} photos`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={() => (dragging.current = false)}
      style={{ touchAction: 'pan-y' }}
    >
      <div
        className={cn(
          'relative h-[58vw] max-h-[520px] min-h-[340px] w-full overflow-hidden'
        )}
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className={cn(
              'absolute left-1/2 top-1/2 aspect-[4/3] w-[80%] max-w-[520px] opacity-0 lg:w-[460px]',
              i === 0 && 'shadow-soft'
            )}
            aria-hidden={i !== active}
          >
            <div
              className={cn(
                'relative h-full w-full overflow-hidden border border-border bg-muted'
              )}
            >
              <Image
                src={src}
                alt={`${alt} — photo ${i + 1} of ${total}`}
                fill
                draggable={false}
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
                className={cn('object-contain p-4', i === active && 'p-6')}
                sizes="(min-width: 1024px) 460px, 80vw"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'gallery-controls mt-6 flex items-center justify-between gap-4'
        )}
      >
        <div className={cn('flex items-center gap-3')}>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={isFirst}
            aria-label="Previous image"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center border border-border text-foreground transition-colors duration-fast hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none'
            )}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={isLast}
            aria-label="Next image"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center border border-border text-foreground transition-colors duration-fast hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none'
            )}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <div className={cn('flex flex-1 flex-col items-end gap-2')}>
          <div
            className={cn(
              'text-xs font-bold uppercase tracking-[0.2em] text-foreground'
            )}
          >
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(total).padStart(2, '0')}
          </div>
          <div
            className={cn('h-px w-full max-w-[200px] bg-border')}
            role="presentation"
          >
            <div
              className={cn(
                'h-full bg-primary transition-[width] duration-500 ease-out'
              )}
              style={{ width: `${((active + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
