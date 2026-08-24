'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Button as AriaButton,
  ModalOverlay,
  Modal,
  Dialog,
} from 'react-aria-components'
import { Menu, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { signOutAction } from '@/features/auth/actions/auth.actions'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/vehicles', label: 'Vehicles' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/testimonials', label: 'Testimonials' },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav data-ui="admin-nav" className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            data-ui="admin-nav-link"
            className={cn(
              'border-l-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-200',
              active
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent text-foreground hover:bg-muted'
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div data-ui="admin-shell" className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-background lg:block">
        <div className="border-b border-border px-5 py-5">
          <Link
            href="/admin"
            className="text-sm font-bold uppercase tracking-wider text-foreground"
          >
            Wing&apos;s Admin
          </Link>
        </div>
        <NavLinks pathname={pathname} />
        <div className="mt-auto border-t border-border p-4">
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm" className="w-full">
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <Link
          href="/admin"
          className="text-sm font-bold uppercase tracking-wider text-foreground"
        >
          Wing&apos;s Admin
        </Link>
        <AriaButton
          onPress={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-10 w-10 items-center justify-center border border-border text-foreground"
        >
          <Menu size={18} aria-hidden="true" />
        </AriaButton>
      </div>

      {/* Mobile drawer */}
      <ModalOverlay
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        className="fixed inset-0 z-50 flex bg-black/40 lg:hidden"
      >
        <Modal className="ml-auto h-full w-64 border-l border-border bg-background">
          <Dialog className="flex h-full flex-col">
            <div className="border-b border-border px-4 py-3 text-sm font-bold uppercase tracking-wider">
              Menu
            </div>
            <NavLinks
              pathname={pathname}
              onNavigate={() => setDrawerOpen(false)}
            />
            <div className="mt-auto border-t border-border p-4">
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Sign out
                </Button>
              </form>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>

      <main className="flex-1">{children}</main>
    </div>
  )
}
