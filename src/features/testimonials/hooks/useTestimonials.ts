'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listTestimonialsAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  setTestimonialVisibleAction,
} from '../actions/testimonial.actions'
import type {
  TestimonialInput,
  Testimonial,
} from '../services/testimonial.service'

export function useTestimonialsAdmin() {
  return useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: async () => {
      const result = await listTestimonialsAction()
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
  })
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: TestimonialInput) => {
      const result = await createTestimonialAction(input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
    },
  })
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: TestimonialInput
    }) => {
      const result = await updateTestimonialAction(id, input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
    },
  })
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTestimonialAction(id)
      if (!result.ok) throw new Error(result.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
    },
  })
}

export function useSetTestimonialVisible() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      isVisible,
    }: {
      id: string
      isVisible: boolean
    }) => {
      const result = await setTestimonialVisibleAction(id, isVisible)
      if (!result.ok) throw new Error(result.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] })
    },
  })
}
