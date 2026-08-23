import type {
  Vehicle,
  VehicleStatusFilter,
} from '@/features/vehicles/types/vehicle'
import { slugify } from '@/lib/utils'

export type VehicleFilters = {
  search?: string
  status?: VehicleStatusFilter
  category?: string
}

export function filterVehicles(
  vehicles: Vehicle[],
  filters: VehicleFilters
): Vehicle[] {
  const search = filters.search?.trim().toLowerCase()
  const status = filters.status ?? 'all'
  const category = filters.category?.trim().toLowerCase()

  return vehicles.filter((vehicle) => {
    if (status !== 'all' && vehicle.status !== status) return false

    if (category && slugify(vehicle.category) !== category) return false

    if (search) {
      const haystack =
        `${vehicle.brand} ${vehicle.model} ${vehicle.year}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }

    return true
  })
}
