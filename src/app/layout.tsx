import type { Metadata } from 'next'
import './globals.css'
import { SmoothScrollProvider } from '@/components/shared/smooth-scroll-provider'

export const metadata: Metadata = {
  title: "Wing's Buy n Sell",
  description: 'Japanese surplus mini vans in Davao City.',
  openGraph: {
    title: "Wing's Buy n Sell",
    description: 'Japanese surplus mini vans in Davao City.',
    type: 'website',
    locale: 'en_PH',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
