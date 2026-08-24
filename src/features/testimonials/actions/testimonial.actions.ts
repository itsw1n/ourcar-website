'use server'

import { requireUser } from '@/lib/supabase/requireUser'
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  setTestimonialVisible,
} from '../services/testimonial.service'
import type {
  TestimonialInput,
  Testimonial,
} from '../services/testimonial.service'

export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: string }

export async function listTestimonialsAction(): Promise<
  ActionResult<Testimonial[]>
> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    return { ok: true, data: await listTestimonials() }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function createTestimonialAction(
  input: TestimonialInput
): Promise<ActionResult<Testimonial>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    return { ok: true, data: await createTestimonial(input) }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function updateTestimonialAction(
  id: string,
  input: TestimonialInput
): Promise<ActionResult<Testimonial>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    return { ok: true, data: await updateTestimonial(id, input) }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function deleteTestimonialAction(
  id: string
): Promise<ActionResult<void>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    await deleteTestimonial(id)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function setTestimonialVisibleAction(
  id: string,
  isVisible: boolean
): Promise<ActionResult<void>> {
  const user = await requireUser()
  if (!user)
    return { ok: false, error: 'Session expired. Please sign in again.' }
  try {
    await setTestimonialVisible(id, isVisible)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
