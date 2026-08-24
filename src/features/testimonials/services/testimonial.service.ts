import { mockTestimonials } from '@/features/testimonials/mockData'
import type { Testimonial } from '@/features/testimonials/mockData'

export type { Testimonial } from '@/features/testimonials/mockData'
import { isMockMode } from '@/lib/dataSource'
import { adminClient } from '@/lib/supabase/admin'

export type TestimonialInput = {
  displayName: string
  quote: string
  rating: number
  isVisible: boolean
}

export async function listTestimonials(): Promise<Testimonial[]> {
  if (isMockMode) return mockTestimonials

  const { data, error } = await adminClient
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => ({
    id: row.id,
    displayName: row.display_name,
    quote: row.quote,
    rating: row.rating,
    isMock: false,
    isVisible: row.is_visible,
  }))
}

export async function createTestimonial(
  input: TestimonialInput
): Promise<Testimonial> {
  if (isMockMode) {
    const testimonial: Testimonial = {
      id: 't' + Math.random().toString(36).slice(2, 8),
      displayName: input.displayName,
      quote: input.quote,
      rating: input.rating,
      isMock: false,
      isVisible: input.isVisible,
    }
    mockTestimonials.unshift(testimonial)
    return testimonial
  }

  const { data, error } = await adminClient
    .from('testimonials')
    .insert({
      display_name: input.displayName,
      quote: input.quote,
      rating: input.rating,
      is_visible: input.isVisible,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return {
    id: data.id,
    displayName: data.display_name,
    quote: data.quote,
    rating: data.rating,
    isMock: false,
    isVisible: data.is_visible,
  }
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput
): Promise<Testimonial> {
  if (isMockMode) {
    const testimonial = mockTestimonials.find((t) => t.id === id)
    if (!testimonial) throw new Error('Testimonial not found')
    testimonial.displayName = input.displayName
    testimonial.quote = input.quote
    testimonial.rating = input.rating
    testimonial.isVisible = input.isVisible
    return testimonial
  }

  const { data, error } = await adminClient
    .from('testimonials')
    .update({
      display_name: input.displayName,
      quote: input.quote,
      rating: input.rating,
      is_visible: input.isVisible,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return {
    id: data.id,
    displayName: data.display_name,
    quote: data.quote,
    rating: data.rating,
    isMock: false,
    isVisible: data.is_visible,
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (isMockMode) {
    const index = mockTestimonials.findIndex((t) => t.id === id)
    if (index !== -1) mockTestimonials.splice(index, 1)
    return
  }
  const { error } = await adminClient.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function setTestimonialVisible(
  id: string,
  isVisible: boolean
): Promise<void> {
  if (isMockMode) {
    const testimonial = mockTestimonials.find((t) => t.id === id)
    if (testimonial) testimonial.isVisible = isVisible
    return
  }
  const { error } = await adminClient
    .from('testimonials')
    .update({ is_visible: isVisible })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
