import { mockVehicles } from '../mockData'
import { mockCategories } from '../mockData'
import type { Vehicle, VehicleInput } from '../types/vehicle'
import { isMockMode } from '@/lib/dataSource'
import { readClient } from '@/lib/supabase/readClient'
import type { VehicleRow } from '@/types/database.types'

export const BUCKET = 'vehicle-images'

type VehicleImageRecord = { storage_path: string; position: number }

export function publicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`
}

function mapMockImages(images: VehicleInput['images']): string[] {
  return images.map((image) => image.url)
}

function categoryNameById(id: string | null): string {
  if (!id) return ''
  return mockCategories.find((category) => category.id === id)?.name ?? ''
}

function mapRow(
  row: VehicleRow,
  categoryName: string,
  images: { url: string; path: string | null }[]
): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    transmission: row.transmission,
    mileageKm: row.mileage_km,
    category: categoryName,
    status: row.status,
    featured: row.featured,
    image: images[0]?.url ?? '',
    images: images.map((image) => image.url),
    imagePaths: images.map((image) => image.path ?? ''),
    description: row.description ?? '',
  }
}

async function fetchCategoryName(id: string): Promise<string> {
  const supabase = await readClient()
  const { data } = await supabase
    .from('categories')
    .select('name')
    .eq('id', id)
    .single()
  return data?.name ?? ''
}

async function fetchVehicleImages(
  vehicleId: string
): Promise<{ url: string; path: string }[]> {
  const supabase = await readClient()
  const { data } = await supabase
    .from('vehicle_images')
    .select('storage_path, position')
    .eq('vehicle_id', vehicleId)
    .order('position', { ascending: true })
  if (!data) return []
  return (data as VehicleImageRecord[]).map((record) => ({
    url: publicUrl(record.storage_path),
    path: record.storage_path,
  }))
}

export async function listVehicles(): Promise<Vehicle[]> {
  if (isMockMode) return mockVehicles

  const supabase = await readClient()
  const { data, error } = await supabase
    .from('vehicles')
    .select(
      '*, category:categories(name), vehicle_images(storage_path, position)'
    )
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  if (!data) return []

  return data.map((row) => {
    const categoryName = (row.category as { name: string } | null)?.name ?? ''
    const images = ((row.vehicle_images as VehicleImageRecord[]) ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((record) => ({
        url: publicUrl(record.storage_path),
        path: record.storage_path,
      }))
    return mapRow(row, categoryName, images)
  })
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  if (isMockMode)
    return mockVehicles.find((vehicle) => vehicle.id === id) ?? null

  const supabase = await readClient()
  const { data, error } = await supabase
    .from('vehicles')
    .select(
      '*, category:categories(name), vehicle_images(storage_path, position)'
    )
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  const categoryName = (data.category as { name: string } | null)?.name ?? ''
  const images = ((data.vehicle_images as VehicleImageRecord[]) ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((record) => ({
      url: publicUrl(record.storage_path),
      path: record.storage_path,
    }))
  return mapRow(data, categoryName, images)
}
