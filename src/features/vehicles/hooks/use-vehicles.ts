import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '@/features/vehicles/queries/vehicles'
import {
  filterVehicles,
  type VehicleFilters,
} from '@/features/vehicles/queries/filter-vehicles'
import type { VehicleStatusFilter } from '@/features/vehicles/types/vehicle'

export function useVehicles(filters: {
  search?: string
  status?: VehicleStatusFilter
  category?: string
}) {
  return useQuery({
    queryKey: [
      'vehicles',
      {
        search: filters.search ?? '',
        status: filters.status ?? 'all',
        category: filters.category ?? '',
      },
    ],
    queryFn: async () => {
      const all = await getVehicles()
      return filterVehicles(all, {
        search: filters.search,
        status: filters.status,
        category: filters.category,
      } satisfies VehicleFilters)
    },
  })
}
