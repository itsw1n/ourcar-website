import { z } from 'zod'

export const transmissionEnum = z.enum(['Automatic', 'Manual'])
export const vehicleStatusEnum = z.enum(['available', 'sold'])

export const vehicleImageSchema = z.object({
  url: z.string(),
  path: z.string().nullable(),
  alt: z.string().optional(),
})

export const vehicleFormSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1900).max(2100),
  transmission: transmissionEnum,
  mileageKm: z.coerce.number().int().min(0),
  categoryId: z.string().min(1, 'Category is required'),
  status: vehicleStatusEnum,
  featured: z.boolean(),
  description: z.string().min(1, 'Description is required'),
  images: z.array(vehicleImageSchema),
})

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>
