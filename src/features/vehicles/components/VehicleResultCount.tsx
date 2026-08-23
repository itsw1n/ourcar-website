'use client'

import { Button } from '@/components/ui/Button'
import { useQueryStates, parseAsString, parseAsStringEnum } from 'nuqs'

export function VehicleResultCount({ count }: { count: number }) {
  const [{ search, status, category }, setFilters] = useQueryStates(
    {
      search: parseAsString,
      status: parseAsStringEnum(['all', 'available', 'sold']),
      category: parseAsString,
    },
    { clearOnDefault: true }
  )

  const hasFilters =
    Boolean(search) || (status != null && status !== 'all') || Boolean(category)

  return (
    <div
      data-ui="vehicle-result-count"
      className="flex items-center justify-between gap-4"
    >
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        {count} {count === 1 ? 'Vehicle' : 'Vehicles'}
      </p>
      {hasFilters ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            void setFilters({ search: null, status: null, category: null })
          }
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
