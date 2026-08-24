export type VehicleStatus = 'available' | 'sold'

export type VehicleStatusFilter = 'all' | 'available' | 'sold'

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
  featured: boolean
  image: string
  images: string[]
  description: string
  imagePaths?: string[]
}

export function vehicleImages(vehicle: Vehicle): string[] {
  if (vehicle.images && vehicle.images.length > 0) return vehicle.images
  return [vehicle.image]
}

export type VehicleImageInput = {
  url: string
  path: string | null
  alt?: string
}

export type VehicleInput = {
  id?: string
  slug: string
  brand: string
  model: string
  year: number
  transmission: string
  mileageKm: number
  categoryId: string
  status: VehicleStatus
  featured: boolean
  description: string
  images: VehicleImageInput[]
}
