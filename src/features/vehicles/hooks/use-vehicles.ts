import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '@/features/vehicles/queries/vehicles'
import {
  filterVehicles,
  type VehicleFilters,
} from '@/features/vehicles/queries/filter-vehicles'
import type { Vehicle, VehicleStatusFilter } from '@/features/vehicles/types/vehicle'

export function useVehicles(filters: {
  search?: string
  status?: VehicleStatusFilter
  category?: string
  initialData?: Vehicle[]
}) {
  const { search, status, category, initialData } = filters

  const query = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    initialData,
  })

  const data = useMemo(() => {
    if (!query.data) return []
    return filterVehicles(query.data, {
      search: search ?? '',
      status: status ?? 'all',
      category: category ?? '',
    } satisfies VehicleFilters)
  }, [query.data, search, status, category])

  return { ...query, data }
}
