'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Label } from 'react-aria-components'
import {
  vehicleFormSchema,
  type VehicleFormValues,
} from '@/features/vehicles/schemas/vehicle.schema'
import { useCategoriesAdmin } from '@/features/categories/hooks/useCategories'
import {
  useCreateVehicle,
  useUpdateVehicle,
  useAdminVehicle,
} from '@/features/vehicles/hooks/useAdminVehicles'
import { ImageUploader } from './ImageUploader'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { LoadingState, ErrorState } from '@/features/admin/components/States'
import { cn } from '@/lib/utils'
import { slugify } from '@/lib/utils'
import type {
  VehicleInput,
  VehicleImageInput,
} from '@/features/vehicles/types/vehicle'

export function VehicleForm({ vehicleId }: { vehicleId?: string }) {
  const router = useRouter()
  const categories = useCategoriesAdmin()
  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()
  const existing = useAdminVehicle(vehicleId ?? '')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: 2020,
      transmission: 'Automatic',
      mileageKm: 0,
      categoryId: '',
      status: 'available',
      featured: false,
      description: '',
      images: [],
    },
  })

  useEffect(() => {
    if (vehicleId && existing.data) {
      const vehicle = existing.data
      const category = categories.data?.find((c) => c.name === vehicle.category)
      reset({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        transmission: vehicle.transmission as VehicleFormValues['transmission'],
        mileageKm: vehicle.mileageKm,
        categoryId: category?.id ?? '',
        status: vehicle.status,
        featured: vehicle.featured,
        description: vehicle.description,
        images: (vehicle.images ?? []).map((url, index) => ({
          url,
          path: vehicle.imagePaths?.[index] ?? null,
          alt: '',
        })) as VehicleImageInput[],
      })
    }
  }, [vehicleId, existing.data, categories.data, reset])

  const images = watch('images')
  const isEditing = Boolean(vehicleId)
  const pending = createVehicle.isPending || updateVehicle.isPending
  const mutationError =
    createVehicle.error?.message ?? updateVehicle.error?.message

  function onSubmit(values: VehicleFormValues) {
    const input: VehicleInput = {
      slug: slugify(`${values.brand}-${values.model}-${values.year}`),
      brand: values.brand,
      model: values.model,
      year: Number(values.year),
      transmission: values.transmission,
      mileageKm: Number(values.mileageKm),
      categoryId: values.categoryId,
      status: values.status,
      featured: values.featured,
      description: values.description,
      images: values.images,
    }

    if (vehicleId) {
      updateVehicle.mutate(
        { id: vehicleId, input },
        { onSuccess: () => router.push('/admin/vehicles') }
      )
    } else {
      createVehicle.mutate(input, {
        onSuccess: () => router.push('/admin/vehicles'),
      })
    }
  }

  if (isEditing && existing.isLoading) return <LoadingState />
  if (isEditing && existing.error)
    return <ErrorState error={existing.error.message} />
  if (categories.error) return <ErrorState error={categories.error.message} />

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6"
      data-ui="vehicle-form"
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">
          {isEditing ? 'Edit vehicle' : 'Add vehicle'}
        </h1>
        <Button href="/admin/vehicles" variant="outline" size="sm">
          Cancel
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Brand" error={errors.brand?.message}>
          <input
            {...register('brand')}
            className={inputClass}
            placeholder="Suzuki"
          />
        </Field>

        <Field label="Model" error={errors.model?.message}>
          <input
            {...register('model')}
            className={inputClass}
            placeholder="Every"
          />
        </Field>

        <Field label="Year" error={errors.year?.message}>
          <input type="number" {...register('year')} className={inputClass} />
        </Field>

        <Field label="Mileage (km)" error={errors.mileageKm?.message}>
          <input
            type="number"
            {...register('mileageKm')}
            className={inputClass}
          />
        </Field>

        <Select
          label="Transmission"
          value={watch('transmission')}
          onChange={(value) =>
            setValue('transmission', value as VehicleFormValues['transmission'])
          }
          options={[
            { value: 'Automatic', label: 'Automatic' },
            { value: 'Manual', label: 'Manual' },
          ]}
        />

        <Select
          label="Category"
          value={watch('categoryId')}
          onChange={(value) => setValue('categoryId', value)}
          options={(categories.data ?? []).map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />

        <Select
          label="Status"
          value={watch('status')}
          onChange={(value) =>
            setValue('status', value as VehicleFormValues['status'])
          }
          options={[
            { value: 'available', label: 'Available' },
            { value: 'sold', label: 'Sold' },
          ]}
        />

        <Field label="Featured">
          <label className="flex items-center gap-2 py-3 text-sm">
            <input
              type="checkbox"
              {...register('featured')}
              className="h-4 w-4"
            />
            Show on homepage
          </label>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Description" error={errors.description?.message}>
          <textarea
            {...register('description')}
            rows={4}
            className={cn(inputClass, 'resize-y')}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground">
          Images
        </Label>
        <ImageUploader
          value={images}
          onChange={(next) => setValue('images', next)}
        />
      </div>

      {mutationError ? (
        <p
          role="alert"
          className="mt-5 border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
        >
          {mutationError}
        </p>
      ) : null}

      <div className="mt-6">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : isEditing ? 'Save changes' : 'Create vehicle'}
        </Button>
      </div>
    </form>
  )
}

const inputClass =
  'w-full border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-primary'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-primary">{error}</p>
      ) : null}
    </div>
  )
}
