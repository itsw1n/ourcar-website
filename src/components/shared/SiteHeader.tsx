'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { siteConfig, getMessengerHref, getPhoneHref } from '@/config/site'

const MobileNavigation = dynamic(
  () =>
    import('@/components/shared/MobileNavigation').then(
      (m) => m.MobileNavigation
    ),
  { ssr: false }
)

const navLinkClassName = `group relative transition-colors duration-200 hover:text-primary aria-[current=true]:text-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 aria-[current=true]:after:scale-x-100 motion-reduce:after:transition-none motion-reduce:hover:after:scale-x-0`

export function SiteHeader() {
  const messenger = getMessengerHref()
  const phone = getPhoneHref()
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      data-ui="site-header"
      className={cn('sticky top-0 z-50 border-b border-border bg-background')}
    >
      <Container className={cn('flex items-center justify-between py-4')}>
        <Link
          href="/"
          aria-label="Wing's Buy n Sell — home"
          className="block transition-opacity duration-200 hover:opacity-90"
        >
          <BrandLogo />
        </Link>

        <nav
          className={cn(
            'hidden items-center gap-8 text-xs font-bold uppercase tracking-wider md:flex'
          )}
        >
          {siteConfig.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'true' : undefined}
              className={navLinkClassName}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={cn('flex items-center gap-2')}>
          {phone ? (
            <a
              href={phone}
              className={cn(
                'hidden min-h-11 items-center gap-2 border border-border px-4 py-3 text-xs font-bold transition-colors duration-fast hover:bg-muted md:flex'
              )}
            >
              <Phone size={16} aria-hidden="true" />
              Call / Text
            </a>
          ) : null}

          {messenger ? (
            <Button
              href={messenger}
              variant="dark"
              className="hidden md:inline-flex"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Message Us
            </Button>
          ) : (
            <Button variant="dark" disabled className="hidden md:inline-flex">
              <MessageCircle size={16} aria-hidden="true" />
              Message Us
            </Button>
          )}

          <MobileNavigation />
        </div>
      </Container>
    </header>
  )
}
