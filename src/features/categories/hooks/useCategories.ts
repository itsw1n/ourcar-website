'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listCategoriesAdminAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '../actions/category.actions'
import type {
  CategoryInput,
  CategoryAdminView,
} from '../services/category.service'

export function useCategoriesAdmin() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const result = await listCategoriesAdminAction()
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      const result = await createCategoryAction(input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CategoryInput }) => {
      const result = await updateCategoryAction(id, input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategoryAction(id)
      if (!result.ok) throw new Error(result.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
  })
}
