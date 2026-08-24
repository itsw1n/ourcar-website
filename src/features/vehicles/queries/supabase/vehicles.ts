import { listVehicles } from '@/features/vehicles/services/vehicle.service'
import type { Vehicle } from '@/features/vehicles/types/vehicle'

export async function getVehiclesFromDb(): Promise<Vehicle[]> {
  return listVehicles()
}
