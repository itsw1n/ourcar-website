export type VehicleStatus = 'available' | 'sold'

export type Vehicle = {
  id: string
  slug: string
  brand: string
  model: string
  year: number
  transmission: string
  mileageKm: number
  category: string
  status: VehicleStatus
  image: string
}
