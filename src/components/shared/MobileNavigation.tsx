'use client'

import {
  DialogTrigger,
  ModalOverlay,
  Modal,
  Dialog,
  Button as AriaButton,
} from 'react-aria-components'
import { usePathname } from 'next/navigation'
import { Menu, X, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { siteConfig, getMessengerHref, getPhoneHref } from '@/config/site'

export function MobileNavigation() {
  const messenger = getMessengerHref()
  const phone = getPhoneHref()
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <DialogTrigger>
      <AriaButton
        aria-label="Open menu"
        className="inline-flex h-11 w-11 items-center justify-center border border-border text-foreground md:hidden"
      >
        <Menu size={20} aria-hidden="true" />
      </AriaButton>

      <ModalOverlay className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm">
        <Modal className="fixed inset-0 flex justify-end">
          <Dialog className="flex h-full w-[82%] max-w-sm flex-col bg-background p-6 outline-none">
            {({ close }) => (
              <>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-sm font-black uppercase tracking-wide">
                    Menu
                  </span>
                  <AriaButton
                    aria-label="Close menu"
                    onPress={close}
                    className="inline-flex h-10 w-10 items-center justify-center text-foreground"
                  >
                    <X size={20} aria-hidden="true" />
                  </AriaButton>
                </div>

                <nav className="mt-6 flex flex-col gap-1">
                  {siteConfig.navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      aria-current={isActive(item.href) ? 'true' : undefined}
                      className="border-b border-border py-4 text-sm font-bold uppercase tracking-wider transition-colors duration-fast hover:text-primary aria-[current=true]:text-primary"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-3 pt-6">
                  {messenger ? (
                    <Button
                      variant="primary"
                      size="md"
                      href={messenger}
                      onClick={close}
                      className="w-full"
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                      Message Us
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="md"
                      disabled
                      className="w-full"
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                      Messenger soon
                    </Button>
                  )}
                  {phone ? (
                    <Button
                      variant="outline"
                      size="md"
                      href={phone}
                      onClick={close}
                      className="w-full"
                    >
                      <Phone size={18} aria-hidden="true" />
                      Call / Text
                    </Button>
                  ) : null}
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
