'use client'

import { useQueryState, parseAsStringEnum } from 'nuqs'
import { Select } from '@/components/ui/Select'
import type { VehicleStatusFilter } from '@/features/vehicles/types/vehicle'

const OPTIONS: { value: VehicleStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
]

export function VehicleStatusFilter() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum(['all', 'available', 'sold'])
      .withDefault('all')
      .withOptions({ clearOnDefault: true })
  )

  return (
    <Select
      data-ui="status-filter"
      ariaLabel="Filter by status"
      hideLabel
      value={status}
      onChange={(key) => void setStatus(key as VehicleStatusFilter)}
      options={OPTIONS}
      className="w-full md:w-44"
    />
  )
}
