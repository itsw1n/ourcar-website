import { memo } from 'react'
import { VehicleCard } from '@/components/shared/vehicle-card'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

export const VehicleGrid = memo(function VehicleGrid({
  vehicles,
}: {
  vehicles: Vehicle[]
}) {
  return (
    <div
      data-ui="vehicle-grid"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} className="w-full" />
      ))}
    </div>
  )
})

export function VehicleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      data-ui="vehicle-grid-skeleton"
      aria-hidden="true"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex h-full flex-col border border-border">
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="h-5 w-1/2 animate-pulse bg-muted" />
            <div className="h-4 w-1/3 animate-pulse bg-muted" />
            <div className="h-4 w-1/4 animate-pulse bg-muted" />
            <div className="h-4 w-2/5 animate-pulse bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
