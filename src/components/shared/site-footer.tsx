import { BrandLogo } from '@/components/shared/brand-logo'
import { Container } from '@/components/layout/container'
import { cn } from '@/lib/utils'
import { siteConfig, getMessengerHref, getPhoneHref } from '@/config/site'
import { MessageCircle, Phone } from 'lucide-react'

const footerLinkClassName = `group relative transition-colors duration-200 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 motion-reduce:after:transition-none motion-reduce:hover:after:scale-x-0`

export function SiteFooter() {
  const messenger = getMessengerHref()
  const phone = getPhoneHref()

  return (
    <footer data-ui="site-footer" className={cn('border-t border-border')}>
      <Container className={cn('grid gap-10 py-12 md:grid-cols-3')}>
        <div>
          <BrandLogo />
        </div>

        <p className={cn('max-w-sm text-sm leading-6 text-muted-foreground')}>
          {siteConfig.tagline}
        </p>

        <div className={cn('flex flex-col text-right')}>
          <div className={cn('font-bold')}>{siteConfig.location}</div>
          <div
            className={cn(
              'mt-4 flex gap-2 text-sm text-muted-foreground md:justify-end'
            )}
          >
            {messenger ? (
              <a
                href={messenger}
                className={cn(
                  'inline-flex items-center gap-2',
                  footerLinkClassName
                )}
              >
                <MessageCircle size={14} aria-hidden="true" />
                Messenger
              </a>
            ) : (
              <span>Messenger soon</span>
            )}

            {phone ? (
              <a
                href={phone}
                className={cn(
                  'inline-flex items-center gap-2',
                  footerLinkClassName
                )}
              >
                <Phone size={14} aria-hidden="true" />
                Call / Text
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </footer>
  )
}
