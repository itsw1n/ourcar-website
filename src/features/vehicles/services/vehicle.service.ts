import { mockVehicles } from '../mockData'
import { mockCategories } from '../mockData'
import type { Vehicle, VehicleInput, VehicleStatus } from '../types/vehicle'
import { isMockMode } from '@/lib/dataSource'
import { adminClient } from '@/lib/supabase/admin'
import { readClient } from '@/lib/supabase/readClient'
import type { VehicleRow } from '@/types/database.types'

const BUCKET = 'vehicle-images'

type VehicleImageRecord = { storage_path: string; position: number }

function publicUrl(path: string): string {
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

async function persistImages(
  vehicleId: string,
  images: VehicleInput['images']
) {
  await adminClient.from('vehicle_images').delete().eq('vehicle_id', vehicleId)
  if (images.length === 0) return
  const rows = images
    .filter((image) => image.path)
    .map((image, index) => ({
      vehicle_id: vehicleId,
      storage_path: image.path as string,
      alt_text: image.alt ?? null,
      position: index,
    }))
  if (rows.length > 0) {
    const { error } = await adminClient.from('vehicle_images').insert(rows)
    if (error) throw new Error(error.message)
  }
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  if (isMockMode) {
    const id = input.id ?? crypto.randomUUID()
    const vehicle: Vehicle = {
      id,
      slug: input.slug,
      brand: input.brand,
      model: input.model,
      year: input.year,
      transmission: input.transmission,
      mileageKm: input.mileageKm,
      category: categoryNameById(input.categoryId),
      status: input.status,
      featured: input.featured,
      image: input.images[0]?.url ?? '',
      images: mapMockImages(input.images),
      imagePaths: input.images.map((image) => image.path ?? ''),
      description: input.description,
    }
    mockVehicles.unshift(vehicle)
    return vehicle
  }

  const categoryName = await fetchCategoryName(input.categoryId)
  const { data, error } = await adminClient
    .from('vehicles')
    .insert({
      id: input.id,
      slug: input.slug,
      brand: input.brand,
      model: input.model,
      year: input.year,
      transmission: input.transmission,
      mileage_km: input.mileageKm,
      category_id: input.categoryId,
      status: input.status,
      featured: input.featured,
      description: input.description,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await persistImages(data.id, input.images)
  return (await getVehicle(data.id)) as Vehicle
}

export async function updateVehicle(
  id: string,
  input: VehicleInput
): Promise<Vehicle> {
  if (isMockMode) {
    const index = mockVehicles.findIndex((vehicle) => vehicle.id === id)
    if (index === -1) throw new Error('Vehicle not found')
    const updated: Vehicle = {
      id,
      slug: input.slug,
      brand: input.brand,
      model: input.model,
      year: input.year,
      transmission: input.transmission,
      mileageKm: input.mileageKm,
      category: categoryNameById(input.categoryId),
      status: input.status,
      featured: input.featured,
      image: input.images[0]?.url ?? '',
      images: mapMockImages(input.images),
      imagePaths: input.images.map((image) => image.path ?? ''),
      description: input.description,
    }
    mockVehicles[index] = updated
    return updated
  }

  const { error } = await adminClient
    .from('vehicles')
    .update({
      slug: input.slug,
      brand: input.brand,
      model: input.model,
      year: input.year,
      transmission: input.transmission,
      mileage_km: input.mileageKm,
      category_id: input.categoryId,
      status: input.status,
      featured: input.featured,
      description: input.description,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await persistImages(id, input.images)
  return (await getVehicle(id)) as Vehicle
}

export async function deleteVehicle(id: string): Promise<void> {
  if (isMockMode) {
    const index = mockVehicles.findIndex((vehicle) => vehicle.id === id)
    if (index !== -1) mockVehicles.splice(index, 1)
    return
  }

  const { data: images } = await adminClient
    .from('vehicle_images')
    .select('storage_path')
    .eq('vehicle_id', id)

  if (images && images.length > 0) {
    await adminClient.storage
      .from(BUCKET)
      .remove(images.map((record) => record.storage_path))
  }

  const { error } = await adminClient.from('vehicles').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function setVehicleStatus(
  id: string,
  status: VehicleStatus
): Promise<void> {
  if (isMockMode) {
    const vehicle = mockVehicles.find((v) => v.id === id)
    if (vehicle) vehicle.status = status
    return
  }
  const { error } = await adminClient
    .from('vehicles')
    .update({ status })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function uploadVehicleImage(
  file: File
): Promise<{ path: string | null; url: string }> {
  if (isMockMode) {
    return { path: null, url: URL.createObjectURL(file) }
  }

  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'png'
  const path = `${crypto.randomUUID()}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await adminClient.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) throw new Error(error.message)
  return { path, url: publicUrl(path) }
}

export async function deleteVehicleImage(path: string): Promise<void> {
  if (!path || isMockMode) return
  const { error } = await adminClient.storage.from(BUCKET).remove([path])
  if (error) throw new Error(error.message)
}
