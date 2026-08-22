import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Wing's Buy n Sell",
  description: 'Japanese surplus mini vans in Davao City.'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
