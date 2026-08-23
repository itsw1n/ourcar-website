import Link from 'next/link'
import { ArrowLeft, ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/features/vehicles/types/vehicle'
import { getMessengerHref, getPhoneHref } from '@/config/site'

export function VehicleHeader({ vehicle }: { vehicle: Vehicle }) {
  const messenger = getMessengerHref()
  const phone = getPhoneHref()
  const isSold = vehicle.status === 'sold'

  return (
    <Container
      className={cn(
        'grid gap-8 border-b border-border py-10 lg:grid-cols-[1fr_auto] lg:items-end lg:py-14'
      )}
    >
      <div>
        <Link
          href="/cars"
          className={cn(
            'group mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-fast hover:text-primary'
          )}
        >
          <ArrowLeft
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 ease-out group-hover:-translate-x-1 motion-reduce:group-hover:-translate-x-0"
          />
          Back to Browse Cars
        </Link>

        <div className="mb-4">
          <StatusBadge status={vehicle.status} />
        </div>

        <h1
          className={cn(
            'text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl'
          )}
        >
          {vehicle.brand} {vehicle.model}
        </h1>

        <p
          className={cn(
            'mt-4 text-sm font-bold uppercase tracking-wider text-muted-foreground'
          )}
        >
          {vehicle.year} · {vehicle.transmission} ·{' '}
          {vehicle.mileageKm.toLocaleString()} KM
        </p>
      </div>

      <div className={cn('flex flex-col items-start gap-3 lg:items-end')}>
        {isSold ? (
          <>
            <div
              className={cn(
                'text-sm font-black uppercase tracking-[0.2em] text-foreground'
              )}
            >
              This unit has been sold
            </div>
            <Button variant="outline" size="lg" href="/cars?status=available">
              Browse available cars
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              />
            </Button>
          </>
        ) : (
          <>
            {messenger ? (
              <Button href={messenger} variant="primary" size="lg">
                <MessageCircle size={18} aria-hidden="true" />
                Message on Messenger
              </Button>
            ) : (
              <Button variant="primary" size="lg" disabled>
                <MessageCircle size={18} aria-hidden="true" />
                Messenger soon
              </Button>
            )}
            {phone ? (
              <Button href={phone} variant="outline" size="lg">
                <Phone size={18} aria-hidden="true" />
                Call / Text
              </Button>
            ) : null}
          </>
        )}
      </div>
    </Container>
  )
}
