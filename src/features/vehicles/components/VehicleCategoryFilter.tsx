'use client'

import { useQueryState, parseAsString } from 'nuqs'
import { Select } from '@/components/ui/Select'
import type { VehicleCategory } from '@/features/vehicles/types/category'

export function VehicleCategoryFilter({
  categories,
}: {
  categories: VehicleCategory[]
}) {
  const [category, setCategory] = useQueryState(
    'category',
    parseAsString.withOptions({ clearOnDefault: true })
  )

  const options = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((item) => ({ value: item.slug, label: item.name })),
  ]

  return (
    <Select
      data-ui="category-select"
      ariaLabel="Filter by category"
      hideLabel
      value={category ?? 'all'}
      onChange={(key) => void setCategory(key === 'all' ? null : key)}
      options={options}
      className="w-full md:w-56"
    />
  )
}
