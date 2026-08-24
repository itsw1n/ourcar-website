'use client'

import { useAdminVehicles } from '@/features/vehicles/hooks/useAdminVehicles'
import { useCategoriesAdmin } from '@/features/categories/hooks/useCategories'
import { useTestimonialsAdmin } from '@/features/testimonials/hooks/useTestimonials'
import {
  LoadingState,
  ErrorState,
  StatCard,
} from '@/features/admin/components/States'
import { Button } from '@/components/ui/Button'

export function Dashboard() {
  const vehicles = useAdminVehicles()
  const categories = useCategoriesAdmin()
  const testimonials = useTestimonialsAdmin()

  if (vehicles.isLoading || categories.isLoading || testimonials.isLoading) {
    return <LoadingState />
  }
  if (vehicles.error) return <ErrorState error={vehicles.error.message} />
  if (categories.error) return <ErrorState error={categories.error.message} />
  if (testimonials.error)
    return <ErrorState error={testimonials.error.message} />

  const all = vehicles.data ?? []
  const available = all.filter(
    (vehicle) => vehicle.status === 'available'
  ).length
  const sold = all.filter((vehicle) => vehicle.status === 'sold').length

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">
          Dashboard
        </h1>
        <Button href="/admin/vehicles/new" variant="primary" size="sm">
          Add vehicle
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Available" value={available} />
        <StatCard label="Sold" value={sold} />
        <StatCard label="Categories" value={categories.data?.length ?? 0} />
        <StatCard label="Testimonials" value={testimonials.data?.length ?? 0} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Button href="/admin/vehicles" variant="outline" className="py-6">
          Manage vehicles
        </Button>
        <Button href="/admin/categories" variant="outline" className="py-6">
          Manage categories
        </Button>
        <Button href="/admin/testimonials" variant="outline" className="py-6">
          Manage testimonials
        </Button>
      </div>
    </div>
  )
}
