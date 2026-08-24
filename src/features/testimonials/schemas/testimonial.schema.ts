import { z } from 'zod'

export const testimonialFormSchema = z.object({
  displayName: z.string().min(1, 'Name is required'),
  quote: z.string().min(1, 'Quote is required'),
  rating: z.coerce.number().int().min(1).max(5),
  isVisible: z.boolean(),
})

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>
