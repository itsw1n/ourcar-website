import type { Metadata } from 'next'
import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'
import { ContactMotion } from '@/features/contact/components/contact-motion'

export const metadata: Metadata = {
  title: "Contact — Wing's Buy n Sell",
  description:
    'Contact Wing’s Buy n Sell in Davao City, Philippines by Messenger or Call / Text.',
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ContactMotion />
      </main>
      <SiteFooter />
    </>
  )
}
