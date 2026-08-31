import { mockVehicles } from '../mockData'
import { mockCategories } from '../mockData'
import type { Vehicle, VehicleInput, VehicleStatus } from '../types/vehicle'
import { isMockMode } from '@/lib/dataSource'
import { getAdminClient } from '@/lib/supabase/requireUser'
import { readClient } from '@/lib/supabase/readClient'
import { BUCKET, publicUrl, getVehicle } from './vehicle.service'
import type { VehicleRow } from '@/types/database.types'

type VehicleImageRecord = { storage_path: string; position: number }

function mapMockImages(images: VehicleInput['images']): string[] {
  return images.map((image) => image.url)
}

function categoryNameById(id: string | null): string {
  if (!id) return ''
  return mockCategories.find((category) => category.id === id)?.name ?? ''
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

async function persistImages(
  vehicleId: string,
  images: VehicleInput['images']
) {
  const supabase = await getAdminClient()
  await supabase.from('vehicle_images').delete().eq('vehicle_id', vehicleId)
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
    const { error } = await supabase.from('vehicle_images').insert(rows)
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

  const supabase = await getAdminClient()
  const categoryName = await fetchCategoryName(input.categoryId)
  const { data, error } = await supabase
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

  const supabase = await getAdminClient()
  const { error } = await supabase
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

  const supabase = await getAdminClient()
  const { data: images } = await supabase
    .from('vehicle_images')
    .select('storage_path')
    .eq('vehicle_id', id)

  if (images && images.length > 0) {
    await supabase.storage
      .from(BUCKET)
      .remove(images.map((record) => record.storage_path))
  }

  const { error } = await supabase.from('vehicles').delete().eq('id', id)
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
  const supabase = await getAdminClient()
  const { error } = await supabase
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

  const supabase = await getAdminClient()
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'png'
  const path = `${crypto.randomUUID()}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) throw new Error(error.message)
  return { path, url: publicUrl(path) }
}

export async function deleteVehicleImage(path: string): Promise<void> {
  if (!path || isMockMode) return
  const supabase = await getAdminClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw new Error(error.message)
}
