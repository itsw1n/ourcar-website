'use client'

import dynamic from 'next/dynamic'

const SmoothScrollProvider = dynamic(
  () =>
    import('@/components/shared/smooth-scroll-provider').then(
      (m) => m.SmoothScrollProvider
    ),
  { ssr: false }
)

export function Providers() {
  return <SmoothScrollProvider />
}
