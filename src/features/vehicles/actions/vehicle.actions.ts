'use server'

import { requireUser } from '@/lib/supabase/requireUser'
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setVehicleStatus,
  uploadVehicleImage,
  deleteVehicleImage,
} from '../services/vehicle.service'
import type { VehicleInput, Vehicle, VehicleStatus } from '../types/vehicle'

export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: string }

export async function listVehiclesAction(): Promise<ActionResult<Vehicle[]>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    return { ok: true, data: await listVehicles() }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function getVehicleAction(
  id: string
): Promise<ActionResult<Vehicle | null>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    return { ok: true, data: await getVehicle(id) }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function createVehicleAction(
  input: VehicleInput
): Promise<ActionResult<Vehicle>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    const vehicle = await createVehicle(input)
    return { ok: true, data: vehicle }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function updateVehicleAction(
  id: string,
  input: VehicleInput
): Promise<ActionResult<Vehicle>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    const vehicle = await updateVehicle(id, input)
    return { ok: true, data: vehicle }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function deleteVehicleAction(
  id: string
): Promise<ActionResult<void>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    await deleteVehicle(id)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function setVehicleStatusAction(
  id: string,
  status: VehicleStatus
): Promise<ActionResult<void>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    await setVehicleStatus(id, status)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function uploadVehicleImageAction(
  file: File
): Promise<ActionResult<{ path: string | null; url: string }>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    const result = await uploadVehicleImage(file)
    return { ok: true, data: result }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function deleteVehicleImageAction(
  path: string
): Promise<ActionResult<void>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    await deleteVehicleImage(path)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
