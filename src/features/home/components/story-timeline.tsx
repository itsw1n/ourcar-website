'use client'

import { useEffect, useRef } from 'react'
import { User, Wrench, Handshake, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  {
    title: 'Age 20',
    text: 'Started as a helper and learned Japanese surplus mini van conversion and body work from the ground up.',
    Icon: User,
  },
  {
    title: 'Age 28',
    text: 'Became an independent contractor and continued conversion, repair, fabrication and tack welding work.',
    Icon: Wrench,
  },
  {
    title: '3+ Years',
    text: 'Built experience buying and selling Japanese surplus vehicles.',
    Icon: Handshake,
  },
  {
    title: 'Today',
    text: 'At age 44, continues decades of hands-on vehicle work in Davao City.',
    Icon: MapPin,
  },
] as const

export function StoryTimeline() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (reduce) {
        gsap.set('.timeline-line', { scaleY: 1 })
        gsap.set('.timeline-item', { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          delay: i * 0.12,
          scrollTrigger: { trigger: item, start: 'top 85%' },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className={cn('relative')}>
      <div
        className={cn('absolute left-4 top-0 h-full w-px bg-border')}
        aria-hidden="true"
      >
        <div className="timeline-line h-full w-full origin-top bg-primary" />
      </div>

      <ul className={cn('space-y-10 pl-12')}>
        {milestones.map(({ title, text, Icon }) => (
          <li key={title} className={cn('timeline-item relative')}>
            <span
              className={cn(
                'absolute -left-[42px] flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-background text-primary'
              )}
            >
              <Icon size={16} aria-hidden="true" />
            </span>
            <div className={cn('text-sm font-black uppercase tracking-wider')}>
              {title}
            </div>
            <p className={cn('mt-2 max-w-lg text-muted-foreground')}>{text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
