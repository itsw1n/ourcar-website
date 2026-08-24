'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryState, parseAsStringEnum } from 'nuqs'
import {
  MenuTrigger,
  Button as AriaButton,
  Menu,
  MenuItem,
} from 'react-aria-components'
import { MoreVertical, Pencil, Search } from 'lucide-react'
import {
  useAdminVehicles,
  useDeleteVehicle,
  useSetVehicleStatus,
} from '@/features/vehicles/hooks/useAdminVehicles'
import { StatusBadge } from '@/features/admin/components/StatusBadge'
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/features/admin/components/States'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { VehicleStatus } from '@/features/vehicles/types/vehicle'

export function VehiclesTable() {
  const router = useRouter()
  const { data, isLoading, error } = useAdminVehicles()
  const deleteVehicle = useDeleteVehicle()
  const setStatus = useSetVehicleStatus()

  const [search, setSearch] = useQueryState('q', {
    clearOnDefault: true,
  })
  const [status, setStatusFilter] = useQueryState(
    'status',
    parseAsStringEnum(['all', 'available', 'sold']).withDefault('all')
  )

  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const pendingVehicle =
    data?.find((vehicle) => vehicle.id === pendingDelete) ?? null

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error.message} />

  const vehicles = (data ?? []).filter((vehicle) => {
    const matchesStatus = status === 'all' || vehicle.status === status
    const matchesSearch =
      !search ||
      `${vehicle.brand} ${vehicle.model}`
        .toLowerCase()
        .includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  function handleAction(vehicleId: string, key: string) {
    if (key === 'edit') {
      router.push(`/admin/vehicles/${vehicleId}/edit`)
      return
    }
    if (key === 'available') {
      setStatus.mutate({ id: vehicleId, status: 'available' })
      return
    }
    if (key === 'sold') {
      setStatus.mutate({ id: vehicleId, status: 'sold' })
      return
    }
    if (key === 'delete') {
      setPendingDelete(vehicleId)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">
          Vehicles
        </h1>
        <Button href="/admin/vehicles/new" variant="primary" size="sm">
          Add vehicle
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 border border-border px-3 py-2">
          <Search
            size={16}
            aria-hidden="true"
            className="text-muted-foreground"
          />
          <input
            data-ui="vehicle-search"
            value={search ?? ''}
            onChange={(event) => setSearch(event.target.value || null)}
            placeholder="Search brand or model"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="inline-flex border border-border">
          {(['all', 'available', 'sold'] as const).map((option) => (
            <button
              key={option}
              data-ui="vehicle-status-filter"
              onClick={() => setStatusFilter(option)}
              className={cn(
                'px-4 py-2 text-xs font-bold uppercase tracking-wider',
                status === option
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles found"
          description="Adjust filters or add a new vehicle."
        />
      ) : (
        <div className="overflow-x-auto border border-border">
          <table
            data-ui="vehicles-table"
            className="w-full min-w-[640px] text-left text-sm"
          >
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-bold">Vehicle</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Year</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold" />
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  data-ui="vehicle-row"
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={vehicle.image || vehicle.images[0]}
                        alt=""
                        className="h-12 w-16 shrink-0 border border-border object-cover"
                      />
                      <div>
                        <p className="font-bold text-foreground">
                          {vehicle.brand} {vehicle.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.featured ? 'Featured · ' : ''}
                          {vehicle.transmission}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {vehicle.category}
                  </td>
                  <td className="px-4 py-3 text-foreground">{vehicle.year}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={vehicle.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <MenuTrigger>
                      <AriaButton
                        aria-label="Vehicle actions"
                        className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground"
                      >
                        <MoreVertical size={16} aria-hidden="true" />
                      </AriaButton>
                      <Menu
                        onAction={(key) =>
                          handleAction(vehicle.id, String(key))
                        }
                        className="border border-border bg-background py-1"
                      >
                        <MenuItem
                          id="edit"
                          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm outline-none data-[focused]:bg-muted"
                        >
                          <Pencil size={14} aria-hidden="true" /> Edit
                        </MenuItem>
                        <MenuItem
                          id="available"
                          className="cursor-pointer px-4 py-2 text-sm outline-none data-[focused]:bg-muted"
                        >
                          Mark available
                        </MenuItem>
                        <MenuItem
                          id="sold"
                          className="cursor-pointer px-4 py-2 text-sm outline-none data-[focused]:bg-muted"
                        >
                          Mark sold
                        </MenuItem>
                        <MenuItem
                          id="delete"
                          className="cursor-pointer px-4 py-2 text-sm text-primary outline-none data-[focused]:bg-muted"
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </MenuTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Delete vehicle"
        message={`Delete "${pendingVehicle?.brand} ${pendingVehicle?.model}"? This cannot be undone.`}
        pending={deleteVehicle.isPending}
        onConfirm={() => {
          if (pendingDelete) {
            deleteVehicle.mutate(pendingDelete, {
              onSuccess: () => setPendingDelete(null),
            })
          }
        }}
      />
    </div>
  )
}
