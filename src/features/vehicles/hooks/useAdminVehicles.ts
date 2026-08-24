'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listVehiclesAction,
  getVehicleAction,
  createVehicleAction,
  updateVehicleAction,
  deleteVehicleAction,
  setVehicleStatusAction,
  uploadVehicleImageAction,
  deleteVehicleImageAction,
} from '../actions/vehicle.actions'
import type { VehicleInput, Vehicle, VehicleStatus } from '../types/vehicle'

export function useAdminVehicles() {
  return useQuery({
    queryKey: ['admin', 'vehicles'],
    queryFn: async () => {
      const result = await listVehiclesAction()
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
  })
}

export function useAdminVehicle(id: string) {
  return useQuery({
    queryKey: ['admin', 'vehicle', id],
    queryFn: async () => {
      const result = await getVehicleAction(id)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(id),
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: VehicleInput) => {
      const result = await createVehicleAction(input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] })
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: VehicleInput }) => {
      const result = await updateVehicleAction(id, input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'vehicle', variables.id],
      })
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteVehicleAction(id)
      if (!result.ok) throw new Error(result.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] })
    },
  })
}

export function useSetVehicleStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: VehicleStatus
    }) => {
      const result = await setVehicleStatusAction(id, status)
      if (!result.ok) throw new Error(result.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] })
    },
  })
}

export function useUploadVehicleImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const result = await uploadVehicleImageAction(file)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
  })
}

export function useDeleteVehicleImage() {
  return useMutation({
    mutationFn: async (path: string) => {
      const result = await deleteVehicleImageAction(path)
      if (!result.ok) throw new Error(result.error)
    },
  })
}
