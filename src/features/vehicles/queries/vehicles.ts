import { mockVehicles } from '../mockData'
import type { Vehicle } from '../types/vehicle'
import { isMockMode } from '@/lib/dataSource'

export { mockVehicles }

export async function getVehicles(): Promise<Vehicle[]> {
  if (isMockMode) return mockVehicles
  const { getVehiclesFromDb } = await import('./supabase/vehicles')
  return getVehiclesFromDb()
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const vehicles = await getVehicles()
  return vehicles.filter((vehicle) => vehicle.featured)
}
