import type { Metadata } from 'next'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Providers } from '@/components/shared/Providers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

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
      <head>
        {supabaseUrl ? (
          <link rel="preconnect" href={supabaseUrl} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body>
        <NuqsAdapter>
          {children}
          <Providers />
        </NuqsAdapter>
      </body>
    </html>
  )
}
