import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/features/vehicles/types/vehicle'
import { StatusBadge } from './StatusBadge'

export const VehicleCard = memo(function VehicleCard({
  vehicle,
  className,
}: {
  vehicle: Vehicle
  className?: string
}) {
  const href = `/cars/${vehicle.slug}`
  return (
    <article
      data-ui="vehicle-card"
      className={cn(
        'group flex h-full w-[280px] flex-col border border-border bg-background transition-transform duration-200 hover:-translate-y-[3px] hover:border-foreground/30',
        className
      )}
    >
      <Link
        href={href}
        aria-label={`${vehicle.brand} ${vehicle.model}`}
        className="block focus-visible:outline-none"
      >
        <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(min-width: 768px) 280px, 90vw"
            className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.03]"
          />
          <StatusBadge
            status={vehicle.status}
            className="absolute left-3 top-3"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4">
        <h3 className="text-lg font-black uppercase tracking-tight">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {vehicle.year} · {vehicle.transmission}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {vehicle.mileageKm.toLocaleString()} km
        </p>
        <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
          {vehicle.category}
        </p>

        <div className="mt-5 border-t border-border pt-4">
          <Button
            variant="ghost"
            size="sm"
            href={href}
            className="w-full justify-between"
          >
            View details
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            />
          </Button>
        </div>
      </div>
    </article>
  )
})
