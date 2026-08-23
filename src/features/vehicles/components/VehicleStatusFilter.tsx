'use client'

import { ToggleButtonGroup, ToggleButton } from 'react-aria-components'
import { useQueryState, parseAsStringEnum } from 'nuqs'
import { cn } from '@/lib/utils'
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
    <ToggleButtonGroup
      data-ui="status-filter"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={new Set([status])}
      onSelectionChange={(keys) => {
        const next = Array.from(keys as Set<string>)[0] as VehicleStatusFilter
        void setStatus(next)
      }}
      aria-label="Filter by status"
      className="inline-flex gap-1"
    >
      {OPTIONS.map((option) => (
        <ToggleButton
          key={option.value}
          id={option.value}
          data-ui="status-filter-option"
          className={({ isSelected }) =>
            cn(
              'min-h-11 px-5 text-xs font-bold uppercase tracking-wider outline-none transition-colors duration-200',
              'border-b-2 focus-visible:ring-2 focus-visible:ring-primary',
              isSelected
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )
          }
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
