import { VehicleForm } from '@/features/vehicles/components/admin/VehicleForm'

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <VehicleForm vehicleId={id} />
}
