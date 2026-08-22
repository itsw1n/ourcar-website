'use client'

import { Button } from '@/components/ui/button'
import { useQueryStates, parseAsString, parseAsStringEnum } from 'nuqs'

export function VehicleEmptyState() {
  const [, setFilters] = useQueryStates(
    {
      search: parseAsString,
      status: parseAsStringEnum(['all', 'available', 'sold']),
      category: parseAsString,
    },
    { clearOnDefault: true }
  )

  return (
    <div
      data-ui="vehicle-empty-state"
      className="border border-border py-20 text-center"
    >
      <h3 className="text-2xl font-black uppercase tracking-tight">
        No vehicles found
      </h3>
      <p className="mt-3 text-muted-foreground">
        Try changing your search or filters.
      </p>
      <div className="mt-6 flex justify-center">
        <Button
          variant="ghost"
          size="md"
          onClick={() =>
            void setFilters({ search: null, status: null, category: null })
          }
        >
          Clear filters
        </Button>
      </div>
    </div>
  )
}
