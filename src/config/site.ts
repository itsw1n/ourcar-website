export const siteConfig = {
  businessName: "Wing's Buy n Sell",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? '',
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL ?? '',
  location: 'Davao City, Philippines',
  tagline:
    'Japanese surplus mini vans converted and built with experience you can trust.',
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Browse Cars', href: '/cars' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
} as const

export type NavItem = (typeof siteConfig.navigation)[number]

export function getMessengerHref(): string | null {
  const url = siteConfig.messengerUrl.trim()
  return url.length > 0 ? url : null
}

export function getPhoneHref(): string | null {
  const phone = siteConfig.phone.trim()
  return phone.length > 0 ? `tel:${phone}` : null
}
