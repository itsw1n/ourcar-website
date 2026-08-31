import { mockCategories, mockVehicles } from '@/features/vehicles/mockData'
import type { VehicleCategory } from '@/features/vehicles/types/category'
import { isMockMode } from '@/lib/dataSource'
import { getAdminClient } from '@/lib/supabase/requireUser'
import { readClient } from '@/lib/supabase/readClient'
import { slugify } from '@/lib/utils'

export type CategoryAdminView = VehicleCategory & {
  isActive: boolean
  vehicleCount: number
}

export type CategoryInput = { name: string; slug?: string }

function resolveSlug(input: CategoryInput): string {
  return input.slug?.trim() ? slugify(input.slug) : slugify(input.name)
}

export async function listCategories(): Promise<VehicleCategory[]> {
  if (isMockMode) return mockCategories

  const supabase = await readClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listCategoriesAdmin(): Promise<CategoryAdminView[]> {
  if (isMockMode) {
    return mockCategories.map((category) => ({
      ...category,
      isActive: true,
      vehicleCount: mockVehicles.filter(
        (vehicle) => vehicle.category === category.name
      ).length,
    }))
  }

  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, is_active, vehicles(count)')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isActive: row.is_active,
    vehicleCount: (row.vehicles as { count: number }[])[0]?.count ?? 0,
  }))
}

export async function createCategory(
  input: CategoryInput
): Promise<VehicleCategory> {
  const slug = resolveSlug(input)
  if (isMockMode) {
    const category: VehicleCategory = {
      id: slugify(input.name) + '-' + Math.random().toString(36).slice(2, 7),
      name: input.name,
      slug,
    }
    mockCategories.push(category)
    return category
  }

  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: input.name, slug })
    .select('id, name, slug')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<VehicleCategory> {
  const slug = resolveSlug(input)
  if (isMockMode) {
    const category = mockCategories.find((c) => c.id === id)
    if (!category) throw new Error('Category not found')
    category.name = input.name
    category.slug = slug
    return category
  }

  const supabase = await getAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .update({ name: input.name, slug })
    .eq('id', id)
    .select('id, name, slug')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteCategory(
  id: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (isMockMode) {
    const category = mockCategories.find((c) => c.id === id)
    const count = category
      ? mockVehicles.filter((vehicle) => vehicle.category === category.name)
          .length
      : 0
    if (count > 0) {
      return {
        ok: false,
        reason: `Cannot delete: ${count} vehicle(s) use this category.`,
      }
    }
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index !== -1) mockCategories.splice(index, 1)
    return { ok: true }
  }

  const supabase = await getAdminClient()
  const { count } = await supabase
    .from('vehicles')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)
    .eq('is_archived', false)

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      reason: `Cannot delete: ${count} vehicle(s) use this category.`,
    }
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return { ok: true }
}
