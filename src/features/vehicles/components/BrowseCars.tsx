'use client'

import { Button } from '@/components/ui/Button'
import { useQueryStates, parseAsString, parseAsStringEnum } from 'nuqs'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import type { VehicleStatusFilter as StatusFilter } from '@/features/vehicles/types/vehicle'
import { mockCategories } from '@/features/vehicles/mockData'
import type { Vehicle } from '@/features/vehicles/types/vehicle'
import { VehicleSearch } from './VehicleSearch'
import { VehicleStatusFilter } from './VehicleStatusFilter'
import { VehicleCategoryFilter } from './VehicleCategoryFilter'
import { VehicleResultCount } from './VehicleResultCount'
import { VehicleEmptyState } from './VehicleEmptyState'
import { VehicleGrid, VehicleGridSkeleton } from './VehicleGrid'

export function BrowseCars({ initialData }: { initialData?: Vehicle[] }) {
  const [{ search, status, category }] = useQueryStates(
    {
      search: parseAsString,
      status: parseAsStringEnum(['all', 'available', 'sold']).withDefault(
        'all'
      ),
      category: parseAsString,
    },
    { clearOnDefault: true }
  )

  const { data, isLoading, isError, refetch } = useVehicles({
    search: search ?? '',
    status: (status ?? 'all') as StatusFilter,
    category: category ?? '',
    initialData,
  })

  return (
    <div data-ui="browse-cars" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <VehicleSearch />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <VehicleStatusFilter />
          <VehicleCategoryFilter categories={mockCategories} />
        </div>
      </div>

      <VehicleResultCount count={data?.length ?? 0} />

      {isLoading && !data ? (
        <VehicleGridSkeleton count={6} />
      ) : isError ? (
        <div
          data-ui="vehicle-error"
          className="border border-border py-20 text-center"
        >
          <h3 className="text-2xl font-black uppercase tracking-tight">
            We couldn&apos;t load the vehicles.
          </h3>
          <p className="mt-3 text-muted-foreground">Please try again.</p>
          <div className="mt-6 flex justify-center">
            <Button variant="ghost" size="md" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        </div>
      ) : data && data.length === 0 ? (
        <VehicleEmptyState />
      ) : (
        <VehicleGrid vehicles={data ?? []} />
      )}
    </div>
  )
}
