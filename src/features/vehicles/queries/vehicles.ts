import { mockVehicles } from '../mock-data'
import type { Vehicle } from '../types/vehicle'
import { isMockMode } from '@/lib/data-source'

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

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicles = await getVehicles()
  return vehicles.find((vehicle) => vehicle.slug === slug) ?? null
}
