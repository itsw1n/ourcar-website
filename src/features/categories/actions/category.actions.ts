'use server'

import { requireUser } from '@/lib/supabase/requireUser'
import {
  listCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service'
import type {
  CategoryInput,
  CategoryAdminView,
} from '../services/category.service'

export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: string }

export async function listCategoriesAdminAction(): Promise<
  ActionResult<CategoryAdminView[]>
> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    return { ok: true, data: await listCategoriesAdmin() }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function createCategoryAction(
  input: CategoryInput
): Promise<ActionResult<CategoryAdminView>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    const created = await createCategory(input)
    return {
      ok: true,
      data: { ...created, isActive: true, vehicleCount: 0 },
    }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function updateCategoryAction(
  id: string,
  input: CategoryInput
): Promise<ActionResult<CategoryAdminView>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    const updated = await updateCategory(id, input)
    return {
      ok: true,
      data: { ...updated, isActive: true, vehicleCount: 0 },
    }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<ActionResult<void>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    const result = await deleteCategory(id)
    if (!result.ok) return { ok: false, error: result.reason }
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
